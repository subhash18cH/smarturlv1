import { Request, response, Response } from "express"
import { Url } from "../models/url";
import { AuthenticateRequest } from "../middlewares/validateToken";
import { User } from "../models/user";
import { nanoid } from "nanoid"

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
    res.status(201).json(url);
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
    if (!urls || urls.length === 0) {
      res.status(400).json({ message: "Urls not found for this user" });
      return;
    }
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: "Error in shortening URl" });
  }
}

//GET - /api/url/{shortUrl} - for getting long url related to short url
export const getLongUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortURL: shortUrl })
    if (!url) {
      res.status(404).json({ message: "No url found" })
      return;
    }
    url.click_count += 1
    await url.save()
    res.redirect(url.originalURL)
  } catch (error) {
    res.status(500).json({ message: "Error in shortening URl" });
  }
}

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
    const ua = req.useragent;
    const deviceType = ua?.isMobile ? "Mobile" : ua?.isTablet ? "Tablet" : ua?.isDesktop ? "Desktop" : "Unknown";
    const userId = req.user?.userId;
    const userUrls = await Url.find({ ownerUserId: userId })
    const total_clicks = userUrls.reduce((sum, url) => sum + (url.click_count || 0), 0)
    res.status(200).json({ deviceType, total_clicks })
  } catch (error) {
    res.status(500).json({ message: "Error in getting URl stats" });
  }
}
