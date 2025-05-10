import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Ebook } from '../../../../models/ebook';
import { Category } from '../../../../models/category';
import { EbookService } from '../../../../services/ebook.service';
import { CategoryService } from '../../../../services/category.service';
import { environment } from '../../../../../environments/environment';
import { EbookImage } from '../../../../models/ebook.image';
import { UpdateEbookDTO } from '../../../../dtos/ebook/update.ebook.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KindOfBook } from '../../../../models/kind-of-book.enum';
import { EbookMp3 } from '../../../../models/ebook.mp3';

@Component({
  selector: 'app-detail.product.admin',
  templateUrl: './update.product.admin.component.html',
  styleUrls: ['./update.product.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})

export class UpdateProductAdminComponent implements OnInit {
  ebookId: number;
  ebook: Ebook;
  updatedEbook: Ebook;
  categories: Category[] = []; // Dữ liệu động từ categoryService
  currentImageIndex: number = 0;
  images: File[] = [];
  newimage: File[] = [];
  mp3s: File[] = [];
  newimp3: File[] = [];
  selectedCategoryIds: number[] = [];
  audioFile?: File;
  kindOfBookKeys = Object.keys(KindOfBook) as Array<keyof typeof KindOfBook>;
  kindOfBookValues = KindOfBook;


  constructor(
    private ebookService: EbookService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private location: Location,
  ) {
    this.ebookId = 0;
    this.ebook = {} as Ebook;
    this.updatedEbook = {} as Ebook;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ebookId = Number(params.get('id'));
      this.getEbookDetails();
    });
    this.getCategories(1, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger
        this.categories = categories;
        this.preselectCategories(); // Gọi hàm preselectCategories sau khi có ebook details

      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  
  getEbookDetails(): void {
    this.ebookService.getDetailEbook(this.ebookId).subscribe({
      next: (ebook: Ebook) => {
        this.ebook = ebook;
        this.updatedEbook = { ...ebook };
        this.preselectCategories(); // Gọi hàm preselectCategories sau khi có ebook details

        this.selectedCategoryIds = this.ebook.category_id || []; 
        this.preselectCategories(); // Gọi hàm preselectCategories sau khi có ebook details

        this.updatedEbook.ebook_images.forEach((ebook_images: EbookImage) => {
          if (!ebook_images.image_url.startsWith(environment.apiBaseUrl)) {
            ebook_images.image_url = `${environment.apiBaseUrl}/ebooks/images/${ebook_images.image_url}`;
          }
        });
        this.updatedEbook.ebook_mp3s.forEach((ebook_mp3s: EbookMp3) => {
          if (!ebook_mp3s.mp3_url.startsWith(environment.apiBaseUrl)) {
            ebook_mp3s.mp3_url = `${environment.apiBaseUrl}/ebooks/audios/${ebook_mp3s.mp3_url}`;
          }
        }); 
        // if (this.updatedEbook.audioUrl) {
        //   // this.uploadAudio(this.ebookId);
        //   this.updatedEbook.audioUrl = `${environment.apiBaseUrl}/ebooks/audios/${this.updatedEbook.audioUrl}`;
        // }
      },
      complete: () => {

      },
      error: (error: any) => {

      }
    });
  }
  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategoryIds.includes(categoryId);
  }

  onCategoryChange(event: any, categoryId: number): void {
    if (event.target.checked) {
      this.selectedCategoryIds.push(categoryId);
    } else {
      const index = this.selectedCategoryIds.indexOf(categoryId);
      if (index !== -1) {
        this.selectedCategoryIds.splice(index, 1);
      }
    }
  }
  preselectCategories(): void {
    this.categories.forEach(category => {
      category.selected = this.selectedCategoryIds.includes(category.id);
    });
  }
  
  showImage(index: number): void {
    debugger
    if (this.ebook && this.ebook.ebook_images &&
      this.ebook.ebook_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.ebook.ebook_images.length) {
        index = this.ebook.ebook_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }

  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }

  // updateProduct() {

  //   // Kiểm tra loại sách và đặt giá trị price tương ứng
  //   if (this.updatedEbook.kindofbook === KindOfBook.FREE || this.updatedEbook.kindofbook === KindOfBook.MEMBERSHIP) {
  //     this.updatedEbook.price = 0;
  //   }
  
  //   if (this.updatedEbook.kindofbook === KindOfBook.FOR_SALE && this.updatedEbook.price <= 0) {
  //     alert('Ebook bán giá tiền phải lớn hơn 0');
  //     return; // Exit the function to prevent form submission
  //   }

  //   const updateEbookDTO: UpdateEbookDTO = {
  //     name: this.updatedEbook.name,
  //     price: this.updatedEbook.price,
  //     title: this.updatedEbook.title,
  //     kindofbook: this.updatedEbook.kindofbook,
  //     evaluate: this.updatedEbook.evaluate,
  //     audioUrl: this.updatedEbook.audioUrl,
  //     thumbnail: this.updatedEbook.thumbnail,
  //     document: this.updatedEbook.document,
  //     category_id: this.updatedEbook.category_id // Đảm bảo category_id được gửi

  //   };
  //   this.ebookService.updateEbook(this.ebook.id, updateEbookDTO).subscribe({
  //     next: () => {
  //       this.router.navigate(['/admin/ebooks']);

  //       alert("cập nhật thành công");
  //       location.reload();
  //     },
  //     error: (error: any) => {
  //       console.error('Error updating ebook:', error);
  //       if (error.status === 400 && error.error.message.includes('Ebook bán giá tiền phải lớn hơn 0')) {
  //         alert(error.error.message);
  //       } else {
  //         this.handleError(error);
  //       }
  //     }
  //   });
  // }

  updateProduct() {

    // Kiểm tra loại sách và đặt giá trị price tương ứng
    if (this.updatedEbook.kindofbook === KindOfBook.FREE || this.updatedEbook.kindofbook === KindOfBook.MEMBERSHIP) {
      this.updatedEbook.price = 0;
    }
  
    if (this.updatedEbook.kindofbook === KindOfBook.FOR_SALE && this.updatedEbook.price <= 0) {
      alert('Ebook bán giá tiền phải lớn hơn 0');
      return; // Exit the function to prevent form submission
    }
    if (this.updatedEbook.name.length === 0) {
      alert("Tên ebook không để trống");
      return;
    }
    if (this.updatedEbook.title.length === 0) {
      alert("Title ebook không để trống");
      return;
    }
    if (this.updatedEbook.document.length === 0) {
      alert("Văn bản ebook không để trống");
      return;
    }
    const updateEbookDTO: UpdateEbookDTO = {
      name: this.updatedEbook.name,
      price: this.updatedEbook.price,
      title: this.updatedEbook.title,
      kindofbook: this.updatedEbook.kindofbook,
      evaluate: this.updatedEbook.evaluate,
      audioUrl: this.updatedEbook.audioUrl,
      thumbnail: this.updatedEbook.thumbnail,
      document: this.updatedEbook.document,
      category_id: this.selectedCategoryIds // Ensure this is an array
    };
  
    this.ebookService.updateEbook(this.ebook.id, updateEbookDTO).subscribe({
      next: () => {
        this.router.navigate(['/admin/ebooks']);
        alert("Cập nhật thành công");
        location.reload();
      },
      error: (error: any) => {
        console.error('Error updating ebook:', error);
        if (error.status === 400 && error.error.message.includes('Ebook bán giá tiền phải lớn hơn 0')) {
          alert(error.error.message);
        } else {
          this.handleError(error);
        }
      }
    });
  }

  
  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      alert('Vui lòng chọn tối đa 5 hình ảnh..');
      return;
    }
    this.newimage = Array.from(files);
    if (this.newimage.length > 0) {
      this.updatedEbook.thumbnail = this.newimage[0].name;
    }
    this.images = files;
    this.ebookService.uploadImages(this.ebookId, this.images).subscribe({
      next: (imageResponse) => {
        this.images = [];
        this.getEbookDetails();

        location.reload();
      },
      error: (error) => {
        alert(error.error);
        console.error('Error uploading images:', error);
        this.handleError(error);
      }
    });
  }

  onMp3FileChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      alert('Vui lòng chọn tối đa 5 mp3.');
      return;
    }
    this.newimp3 = Array.from(files);
    this.mp3s = files;
    this.ebookService.uploadmp3s(this.ebookId, this.mp3s).subscribe({
      next: (mp3Response) => {
        this.images = [];
        this.getEbookDetails();
        location.reload();
      },
      error: (error) => {
        alert(error.error);
        console.error('Error uploading images:', error);
        this.handleError(error);
        location.reload();
      }

    });

  }

  // onAudioFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.audioFile = file;

  //     // Call uploadAudio service with optional chaining
  //     this.ebookService.uploadAudio(this.ebookId, file).subscribe({
  //       next: (response: any) => {
  //         // Handle successful upload response (optional)
  //         console.log('Audio uploaded successfully:', response);
  //         this.updatedEbook.audioUrl = response.audioUrl || file?.name; // Use optional chaining
  //         alert('Audio uploaded successfully!');
  //       },
  //       error: (error: any) => {

  //         console.error('Error uploading audio:', error);
  //         // alert('Error uploading audio: ' + error.message);
  //         this.handleError(error);
  //         location.reload();
  //       }
  //     });
  //   }
  //}

  // onFileChange(event: any) {
  //   const files = event.target.files;
  //   if (files.length > 5) {
  //     alert('Please select a maximum of 5 images.');
  //     return;
  //   }
  //   this.newimage = Array.from(files);

  //   // Nếu cần cập nhật thumbnail ở backend, không cần làm gì thêm ở đây.

  //   this.images = files;
  //   this.ebookService.uploadImages(this.ebookId, this.images).subscribe({
  //     next: (imageResponse) => {
  //       debugger;
  //       console.log('Images uploaded successfully:', imageResponse);
  //       this.images = [];
  //       this.getEbookDetails();
  //     },
  //     error: (error) => {
  //       alert(error.error);
  //       console.error('Error uploading images:', error);
  //     }
  //   });
  // }


  deleteImage(ebookImage: EbookImage) {
    if (confirm('Bạn có chắc chắn muốn xóa hình ảnh này không?')) {
      // Call the removeImage() method to remove the image   
      this.ebookService.deleteEbookImage(ebookImage.id).subscribe({
        next: (ebookImage: EbookImage) => {
          location.reload();
        },
        error: (error) => {
          // Handle the error while uploading images
          alert(error.error)
          console.error('Lỗi khi xóa hình ảnh:', error);
        }
      });
    }
  }
  deleteMp3(ebookMp3: EbookMp3): void {
    if (confirm('Bạn có chắc chắn muốn xóa tệp MP3 này không?')) {
      this.ebookService.deleteEbookMp3(ebookMp3.id).subscribe({
        next: (ebookMp3: EbookMp3) => {
          location.reload();
        },
        error: (error) => {
          // Handle the error while uploading mp3s
          alert(error.error)
          console.error('Lỗi xóa mp3s:', error);
        }
      });
      // Implement MP3 deletion logic if necessary
      // alert('Chức năng xóa MP3 vẫn chưa được triển khai.');
    }
  }

  uploadAudio(ebookId: number) {
    if (this.audioFile) {
      this.ebookService.uploadAudio(ebookId, this.audioFile).subscribe({
        next: (audioResponse) => {
          console.log('Đã tải âm thanh thành công:', audioResponse);
          location.reload();
        },
        error: (error) => {
          console.error('Lỗi khi tải âm thanh lên:', error);
          alert(`Lỗi khi tải âm thanh lên: ${error.error?.message || error.message}`);
          location.reload();
        }
      });
      location.reload();
    }
  }

  trackByMp3Url(index: number, item: EbookMp3): string {
    return item.mp3_url;
  }

  private handleError(error: any): void {
    console.error('Error:', error);
    switch (error.status) {
      case 401:
        alert('Bạn không có quyền truy cập vào tài nguyên này hoặc cần đăng nhập quản trị viên để thực hiện hành động này.');
        // this.router.navigate(['/']);
        break;
      case 403:
        alert('Bạn không có quyền cập nhật đơn hàng này. Chỉ có quản trị viên mới có quyền thực hiện hành động này.');
        break;
      case 404:
        alert('Không tìm thấy tài nguyên.');
        break;

    }
  }
  formatPrice(price: number | undefined): string {

    if (price === undefined) {
      return 'N/A'; // hoặc giá trị mặc định khác bạn muốn hiển thị
    }
    if (price === 0) {
      return 'Miễn Phí';
    }
    return price.toLocaleString('vi-VN') + ' đ';
  }

}


