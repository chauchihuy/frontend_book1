import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsArray,
} from 'class-validator';
import { KindOfBook } from '../../models/kind-of-book.enum';

export class UpdateEbookDTO {
  @IsPhoneNumber()
  name: string;

  price: number;

  title: string;
  kindofbook: KindOfBook; 
  evaluate: number;
  audioUrl: string;
  thumbnail: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsArray()
  @IsNotEmpty()
  category_id: number[];
  
  audioFile ?: File;

  constructor(data: any) {
    this.name = data.name;
    this.price = data.price;
    this.title = data.title;
    this.kindofbook = data.kindofbook;
    this.evaluate = data.evaluate;
    this.audioUrl = data.audioUrl;
    this.thumbnail = data.thumbnail;
    this.document = data.document;
    this.category_id = data.category_id;
  }
}