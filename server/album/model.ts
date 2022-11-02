import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model'
import type {Circle} from '../circle/model'

/**
 * This file defines the properties stored in a Album
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Album on the backend
export type Album = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  name: String;
  freets: Array<Types.ObjectId | string>;
  circles: Array<Types.ObjectId | string>;
};

export type PopulatedAlbum = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  name: String;
  freets: Array<Freet>;
  circles: Array<Circle>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const AlbumSchema = new Schema<Album>({
  // The userId owner of a circle
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The name of the circle
  name: {
    type: String,
    required: true
  },
  // The freets that make up a circle
  freets: [{
    type: Types.ObjectId,
  }],
  // The circles that make up an album
  circles: [{
    type: Types.ObjectId,
  }]
});

const AlbumModel = model<Album>('Album', AlbumSchema);
export default AlbumModel;
