import { Request, Response } from "express"
import { Url } from "../models/url";
import { AuthenticateRequest } from "../middlewares/validateToken";
import { User } from "../models/user";
import { nanoid } from "nanoid"
import QRCode from "qrcode";
import mongoose from "mongoose";
import { Details } from "express-useragent";

//POST - /api/url/short-url - for shortening a long url
export const shortUrl = async (req: AuthenticateRequest, res: Response): Promise<void> => {
  try {
    const { longUrl }: { longUrl: string } = req.body;
    if (!longUrl) {
      res.status(400).json({ message: "LongUrl is required" })
      return;
    }
    try {
      new URL(longUrl);
    } catch (err) {
      res.status(400).json({ message: "Invalid URL format." });
      return;
    }

    const existing_url = await Url.findOne({ ownerUserId: req.user?.userId, originalURL: longUrl })

    if (existing_url) {
      res.status(200).json(existing_url.shortURL)
      return;
    }

    const url = await Url.create({
      originalURL: longUrl,
      shortURL: nanoid(6),
      ownerUserId: req.user?.userId
    })
    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ message: "Error in shortening URl" });
  }
}

//GET - /api/url/user - for getting user urls
export const getUserUrls = async (req: AuthenticateRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user?.userId;
    const user = User.findById(user_id);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    const urls = await Url.find({ ownerUserId: user_id });
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: "Error in shortening URl" });
  }
}

//GET - /api/url/{shortUrl} - for getting long url related to short url
export const getLongUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortUrl } = req.params;

    // Find the URL document
    const url = await Url.findOne({ shortURL: shortUrl });

    if (!url) {
      res.status(404).json({ message: "URL not found" });
      return;
    }

    // Determine device type from user agent
    const source = req.useragent;
    let deviceType = 'Desktop';

    if (source?.isMobile) {
      deviceType = 'Mobile';
    } else if (source?.isTablet) {
      deviceType = 'Tablet';
    }

    url.click_count = (url.click_count || 0) + 1;

    if (!url.deviceClicks) {
      url.deviceClicks = {};
    }

    url.deviceClicks[deviceType] = (url.deviceClicks[deviceType] || 0) + 1;

    await url.save();

    res.redirect(url.originalURL);

  } catch (error) {
    console.error('Error retrieving URL:', error);
    res.status(500).json({ message: "Error retrieving URL" });
  }
};
//DELETE - /api/url/delete-url - for deleting qr code
export const deleteURL = async (req: AuthenticateRequest, res: Response): Promise<void> => {
  try {
    const { shortUrl }: { shortUrl: string } = req.body;
    if (!shortUrl) {
      res.status(400).json({ message: "shortUrl is required" });
      return;
    }
    const url = await Url.findOne({ shortURL: shortUrl });
    if (!url) {
      res.status(404).json({ message: "URL not found" });
      return;
    }
    await url.deleteOne();
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting QR code", error });
  }
}

// GET - /api/url/daily-clicks - returns daily clicks for the logged-in user
export const getDailyClicks = async (req: AuthenticateRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User not authenticated' });
      return;
    }

    const data = await Url.aggregate([
      {
        $match: {
          ownerUserId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
          },
          clickCount: { $sum: "$click_count" }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          clickCount: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    res.status(200).json(data);
  } catch (err) {
    console.error('Error in getDailyClicks:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


//GET - /api/url/total-stats - for getting long url related to short url
export const getUrlStats = async (req: AuthenticateRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const userUrls = await Url.find({ ownerUserId: userId })

    const total_urls = userUrls.length
    const total_clicks = userUrls.reduce((sum, url) => sum + (url.click_count || 0), 0)
    res.status(200).json({
      total_urls,
      total_clicks,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in getting URl stats" });
  }
}

//GET - /api/url/device-stats - for getting device stats related to short url
export const getDeviceStats = async (req: AuthenticateRequest, res: Response): Promise<void> => {
  try {

    const userId = req.user?.userId;
    const userUrls = await Url.find({ ownerUserId: userId });
    const deviceClicksArray = userUrls.map(url => ({
      deviceClicks: url.deviceClicks,
    }));
    const total_links = userUrls.length;
    const total_clicks = userUrls.reduce((sum, url) => sum + (url.click_count || 0), 0)
    res.status(200).json({ deviceClicksArray, total_clicks, total_links })
  } catch (error) {
    res.status(500).json({ message: "Error in getting URl stats" });
  }
}


//POST - /api/qrcode/generate - for generating qr code
export const generateQR = async (req: AuthenticateRequest, res: Response): Promise<void> => {
  try {
    const { longUrl }: { longUrl: string } = req.body;
    const userId = req.user?.userId;
    if (!longUrl) {
      res.status(400).json({ message: "Long URL is required" });
      return;
    }
    try {
      new URL(longUrl);
    } catch (err) {
      res.status(400).json({ message: "Invalid URL format." });
      return;
    }
    const existingUrl = await Url.findOne({ originalURL: longUrl, ownerUserId: userId });
    if (existingUrl) {
      const qrCodeBase64 = await QRCode.toDataURL(existingUrl.shortURL);
      existingUrl.qrCode = qrCodeBase64;
      await existingUrl.save();
      res.status(200).json(existingUrl);
      return;
    }
    const shortCode = nanoid(6);
    const qrCodeBase64 = await QRCode.toDataURL(shortCode);
    const newUrl = await Url.create({
      originalURL: longUrl,
      shortURL: shortCode,
      ownerUserId: userId,
      qrCode: qrCodeBase64,
    });
    res.status(200).json(newUrl);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

//GET - /api/qrcode/retrieve - for retrieving qr code
export const getQR = async (req: AuthenticateRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const urls = await Url.find({ ownerUserId: userId, qrCode: { $exists: true, $ne: null, $nin: [""] } })
    const qrCodes = urls.map(url => ({
      originalURL: url.originalURL,
      shortURL: url.shortURL,
      qrCode: url.qrCode,
    }))
    res.status(200).json(qrCodes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }

}

//DELETE - /api/qrcode/delete-qr - for deleting qr code
export const deleteQR = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortUrl }: { shortUrl: string } = req.body;
    if (!shortUrl) {
      res.status(400).json({ message: "shortUrl is required" });
      return;
    }
    const url = await Url.findOne({ shortURL: shortUrl });
    if (!url) {
      res.status(404).json({ message: "URL not found" });
      return;
    }
    url.qrCode = undefined;
    await url.save();
    res.status(200).json({ message: "QR Code deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting QR code", error });
  }
}
