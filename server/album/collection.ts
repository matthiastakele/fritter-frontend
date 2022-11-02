import mongoose from 'mongoose';
import type {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import type {Album} from './model';
import AlbumModel from './model';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';
import CircleCollection from '../circle/collection';
import UserModel from '../user/model';
import FollowModel from '../follow/model';

/**
 * This files contains a class that has the functionality to explore albums
 * stored in MongoDB, including adding, finding, updating, and deleting albums.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Album> is the output of the AlbumModel() constructor,
 * and contains all the information in Album. https://mongoosejs.com/docs/typescript.html
 */
class AlbumCollection {
  /**
   * Add an empty album to the collection
   *
   * @param {string} userId - The id of the author of the album
   * @param {string} name - The id of the name of the album
   * @return {Promise<HydratedDocument<Album>>} - The newly created album
   */
  static async addOne(userId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Album>> {
    const followers = await FollowCollection.findAllFollowers(userId);
    const album = new AlbumModel({
      userId: userId,
      name: name,
      users: new Array<Types.ObjectId>(),
      freets: new Array<Types.ObjectId>(),
      visibility: followers // default visibility is all followers (do public later)
    });
    await album.save(); // Saves freet to MongoDB
    return album.populate('userId');
  }

  /**
   * Delete an album with given albumId.
   *
   * @param {string} albumId - The albumId of freet to delete
   * @return {Promise<Boolean>} - true if the album has been deleted, false otherwise
   */
   static async deleteOne(albumId: Types.ObjectId | string): Promise<boolean> {
    const freet = await AlbumModel.deleteOne({_id: albumId});
    return freet !== null;
  }

  /**
   * Get an album by albumId
   *
   * @param {string} AlbumId - The id of the album to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The album with the given albumId, if any
   */
  static async findOne(albumId: Types.ObjectId | string): Promise<HydratedDocument<Album>> {
    return AlbumModel.findOne({_id: albumId}).populate('userId');
  }

   /**
   * Find an album by albumName
   *
   * @param {string} albumName - The id of the album to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The album with the given albumName, if any
   */
    static async findByName(albumName: string): Promise<Array<HydratedDocument<Album>>> {
      return AlbumModel.find({name: albumName}).populate('userId');
    }

  /**
   * Get all the albums in the database
   *
   * @return {Promise<HydratedDocument<Album>[]>} - An array of all of the albums
   */
  static async findAll(): Promise<Array<HydratedDocument<Album>>> {
    // Retrieves albums
    return AlbumModel.find({}).populate('userId');
  }

    /**
   * Get all the albums by given author user id
   *
   * @param {string} userId - The username of author of the freets
   * @return {Promise<HydratedDocument<Album>[]>} - An array of all of the freets
   */
     static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Album>>> {
      return AlbumModel.find({userId: userId}).populate('userId');
    }

  /**
   * Get all the circles by album id
   * @param {string} albumId - The id of the album
   * @return {Promise<HydratedDocument<Album>[]>} - An array of all of the freets
   */
     static async findAllCirclesByAlbumId(albumId: Types.ObjectId | string): Promise<Array<Types.ObjectId | string>> {
      const album = await AlbumCollection.findOne(albumId);
      return album.circles;
    }

    /**
   * Get all the users by album id
   * @param {string} albumId - The id of the album
   * @return {Promise<HydratedDocument<Album>[]>} - An array of all of the freets
   */
     static async findAllUsersByAlbumId(albumId: Types.ObjectId | string) {
      const album = await AlbumModel.findOne({albumId: albumId});
      let users: User[] = [];
      if(album.circles.length == 0){
        const followIds = await FollowCollection.findAllFollowers(album.userId);
        followIds.forEach(async function (followId) {
          const follow = await FollowModel.findOne({_id: followId});
          const user = await UserCollection.findOneByUserId(follow.follower);
          users.push(user);
        }); 
      }
      else{
      album.circles.forEach(async function (circleId) {
        const circle = await CircleCollection.findOne(circleId);
        circle.users.forEach(async function (userId) {
          const user = await UserCollection.findOneByUserId(userId);
          users.push(user);
          }); 
        });
      } 
      return users;
    }

    /**
   * Get all the freets by album id
   * @param {string} albumId - The id of the album
   * @return {Promise<HydratedDocument<Album>[]>} - An array of all of the freets
   */
     static async findAllFreetsByAlbumId(albumId: Types.ObjectId | string): Promise<Array<Types.ObjectId | string>>{
      const album = await AlbumCollection.findOne(albumId);
      return album.freets;
    }

  /**
   * Delete all the albums by the given author
   *
   * @param {string} userId - The id of author of album
   */
   static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await AlbumModel.deleteMany({userId: userId});
  }

  /**
   * Add an existing circle to an album's visbility
   *
   * @param {string} albumId - The id of the album to be updated
   * @param {string} circleName - The name of the circle to add
   * @return {Promise<HydratedDocument<Album>>} - The newly updated album
   */
  static async addCircle(albumId: Types.ObjectId | string, circleName: string): Promise<HydratedDocument<Album>> {
    const album = await AlbumCollection.findOne(albumId);
    var mongoose = require('mongoose');
    const circle = await CircleCollection.findByName(circleName);
    album.circles.push(circle._id);
    await album.save();
    return album.populate('userId');
  }

  /**
   * Delete an existing circle from an album's visbility
   *
   * @param {string} albumId - The id of the album to be updated
   * @param {string} circleId - The id of th circle to delete
   * @return {Promise<HydratedDocument<Album>>} - The newly updated album
   */
   static async deleteCircle(albumId: Types.ObjectId | string, circleId: Types.ObjectId | string): Promise<HydratedDocument<Album>> {
    const album = await AlbumModel.findOne({_id: albumId});
    var mongoose = require('mongoose');
    const circle = await CircleCollection.findOne(circleId);
    const index = album.circles.indexOf(circle._id);
    if (index !== -1) {
      album.circles.splice(index, 1);
    }
    await album.save();
    return album.populate('userId');
  }

  /**
   * Add a new freet to an album
   *
   * @param {string} albumId - The id of the album to be updated
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Album>>} - The newly updated album
   */
   static async addFreet(albumId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Album>> {
    const album = await AlbumModel.findOne({_id: albumId});
    var mongoose = require('mongoose');
    album.freets.push(mongoose.Types.ObjectId(freetId));
    await album.save();
    return album.populate('userId');
  }

  /**
   * Delete a freet from an album
   *
   * @param {string} albumId - The id of the album to be updated
   * @param {string} viewerId - The id of the freet
   * @return {Promise<HydratedDocument<Album>>} - The newly updated album
   */
   static async deleteFreet(albumId: Types.ObjectId | string, freetId: string): Promise<HydratedDocument<Album>> {
    const album = await AlbumModel.findOne({_id: albumId});
    var mongoose = require('mongoose');
    const index = album.circles.indexOf(mongoose.Types.ObjectId(freetId));
    if (index !== -1) {
      album.circles.splice(index, 1);
    }
    await album.save();
    return album.populate('userId');
    
  }

}

export default AlbumCollection;
