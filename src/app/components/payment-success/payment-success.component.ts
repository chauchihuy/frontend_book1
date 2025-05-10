import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
  standalone: true,
  imports: [RouterModule,
    HeaderComponent,
    FooterComponent,
  ],  // Import RouterModule for routing features
  providers: [DatePipe] // add thời gian thanh toán 
})
export class PaymentSuccessComponent implements OnInit {
  orderInfo: string | null = '';
  
  paymentTime: string | null = '';
  transactionId: string | null = '';
  totalPrice: string | null = '';
  currentDateTime: string | null = '';


  constructor(private route: ActivatedRoute, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.currentDateTime = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    this.route.queryParams.subscribe(params => {
      this.orderInfo = params['orderInfo'] || '';
      this.paymentTime = params['paymentTime'] || '';
      this.transactionId = params['transactionId'] || '';
      this.totalPrice = params['totalPrice'] || '';
      if (this.totalPrice && this.totalPrice.length >= 2 && this.totalPrice.endsWith("00")) {
        this.totalPrice = this.totalPrice.slice(0, -2);
      }
    });
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

  getFormattedPrice(): string {
    const price = this.totalPrice ? Number(this.totalPrice) : undefined;
    return this.formatPrice(price);
  }
  getFormattedPaymentTime(): string {
    if (!this.paymentTime) return '';
    return this.datePipe.transform(this.paymentTime, 'dd/MM/yyyy HH:mm') || '';
  }
}

