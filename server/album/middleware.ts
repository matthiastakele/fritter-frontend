import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import AlbumCollection from './collection';
import FreetCollection from '../freet/collection';
import CircleCollection from '../circle/collection';

/**
 * Checks if an album name in req.body exists
 */
 const doesAlbumNameExist = async (req: Request, res: Response, next: NextFunction) => {
  const albums = await AlbumCollection.findByName(req.body.albumName);
  if(albums.length == 0){
      next();
      return;
  }
  res.status(409).json({
  error: {
          cirleName: 'album name already exists'
      }
  });
};

/**
 * Checks if freet in req.body exists
 */
 const doesFreetExistInAlbum = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.body.freetId);
  if(freet == null){
      next();
      return;
  }
  res.status(409).json({
  error: {
          cirleName: 'freet already exists in album'
      }
  });
};

/**
 * Checks if circle name in req.body exists
 */
 const doesCircleNameExistInAlbum = async (req: Request, res: Response, next: NextFunction) => {
  const circle = await CircleCollection.findByName(req.body.freetId);
  if(circle == null){
      next();
      return;
  }
  res.status(409).json({
  error: {
          cirleName: 'circle already exists in album'
      }
  });
};

const doesCircleNameExist = async (req: Request, res: Response, next: NextFunction) => {
  const circle = await CircleCollection.findByName(req.body.circleName);
  if(circle != null){
      next();
      return;
  }
  res.status(409).json({
  error: {
          cirleName: 'circle does not exist'
      }
  });
};

export {
    doesAlbumNameExist,
    doesCircleNameExist
};