import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inner-banner',
  templateUrl: './inner-banner.component.html',
  styleUrls: ['./inner-banner.component.css']
})
export class InnerBannerComponent {
  @Input() title: any;

  ngOnInit(): void {
    console.log(this.title)
  }
}
