import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import AlbumCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as circleValidator from '../circle/middleware';
import * as albumValidator from './middleware';
import UserCollection from '../user/collection';
// import * as util from './util';

const router = express.Router();

/**
 * Create a new album.
 *
 * @name POST /api/albums
 *
 * @return {AlbumResponse} - The created album
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    albumValidator.doesAlbumNameExist
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const album = await AlbumCollection.addOne(userId, req.body.albumName);

    res.status(201).json({
      message: 'Your album was created successfully.',
      album: album
    });
  }
);

/**
 * Delete an album
 *
 * @name DELETE /api/albums/:albumId?
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the albumId is not valid
 */
router.delete(
  '/:albumId?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    await AlbumCollection.deleteOne(req.params.albumId);
    res.status(200).json({
      message: 'Your album was deleted successfully.'
    });
  }
);

/**
 * Add a circle to an album
 *
 * @name PUT /api/albums/:albumId/circles
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the albumId is not valid
 */
 router.put(
  '/:albumId?/circles',
  [
    userValidator.isUserLoggedIn,
    albumValidator.doesCircleNameExist
  ],
  async (req: Request, res: Response) => {
    await AlbumCollection.addCircle(req.params.albumId, req.body.circleName);
    res.status(200).json({
      message: `You added circle to the album successfully.`
    });
  }
);

/**
 * Delete a circle from an album
 *
 * @name DELETE /api/albums/:albumId/circles/:circleId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the albumId is not valid
 */
 router.delete(
  '/:albumId?/circles/:circleId?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    await AlbumCollection.deleteCircle(req.params.albumId, req.params.circleId);
    res.status(200).json({
      message: `You deleted circle from the album successfully.`
    });
  }
);

/**
 * Add a freet to an album
 *
 * @name PUT /api/albums/:albumId/circles
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the albumId is not valid
 */
 router.put(
  '/:albumId?/freets',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    await AlbumCollection.addFreet(req.params.albumId, req.body.freetId);
    res.status(200).json({
      message: `You added freet to the album successfully.`
    });
  }
);

/**
 * Delete a freet from an album
 *
 * @name PUT /api/albums/:albumId/circles
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the albumId is not valid
 */
 router.delete(
  '/:albumId?/freets/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    await AlbumCollection.deleteFreet(req.params.albumId, req.params.freetId);
    res.status(200).json({
      message: `You deleted freet from the album successfully.`
    });
  }
);

/**
 * Get all users from an album
 *
 * @name GET /api/albums/:albumId/users
 *
 * @return {AlbumResponse} - A dictionary of attributes associated with album
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
 router.get(
  '/:albumId?/users',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    //const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const users = await AlbumCollection.findAllUsersByAlbumId(req.params.albumId);
    res.status(200).json({
      users
    });
  }
);

/**
 * Get all circles from an album
 *
 * @name GET /api/albums/:albumId/users
 *
 * @return {AlbumResponse} - A dictionary of attributes associated with album
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
 router.get(
  '/:albumId?/circles',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    //const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const circles = await AlbumCollection.findAllCirclesByAlbumId(req.params.albumId);
    res.status(200).json({
      circles
    });
  }
);

/**
 * Get all freets from an album.
 *
 * @name GET /api/albums
 *
 * @return {AlbumResponse} - A dictionary of attributes associated with album
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
 router.get(
  '/:albumId?/freets',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freets = await AlbumCollection.findAllFreetsByAlbumId(req.params.albumId);
    res.status(200).json(freets);
  }
);

/**
 * Get all albums from userId
 *
 * @name GET /api/albums/user
 *
 * @return {AlbumResponse} - A dictionary of attributes associated with album
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
 router.get(
  '/:userId?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const albums = await AlbumCollection.findAllByUserId(req.params.userId);
    res.status(200).json(albums);
  }
);

export {router as albumRouter};
