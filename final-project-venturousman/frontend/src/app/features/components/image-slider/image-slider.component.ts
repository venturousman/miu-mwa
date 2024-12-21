import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-image-slider',
  imports: [MatTabGroup, MatTab, NgForOf, MatTabLabel],
  templateUrl: 'image-slider.component.html',
  styleUrl: 'image-slider.component.css',
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  slides: string[] = [
    'http://images.stayfolio.com/system/pictures/images/000/138/678/original/0f84452f0ab1dc338ad6fa8baed85b881fe8c922.jpg?1661500229',
    'http://images.stayfolio.com/system/pictures/images/000/138/684/original/c162998442eecb3a424909127846cf69ef6be035.jpg?1661500241',
    'http://images.stayfolio.com/system/pictures/images/000/138/688/original/d760375a37f6c3a66eac41af71c3b1f451e734f0.jpg?1661500249',
  ];
  currentIndex = 0;
  interval: any;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  startAutoPlay(): void {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }, 5000); // Change slides every 3 seconds
  }
}
