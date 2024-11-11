
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from
'@angular/core';
import * as THREE from "three";


@Component({
  selector: 'app-hospital3d',
  standalone: true,
  imports: [],
  templateUrl: './hospital3d.component.html',
  styleUrl: './hospital3d.component.scss'
})
export class Hospital3dComponent implements AfterViewInit {

  @ViewChild('myCanvas') private canvasRef!: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  
  public ngAfterViewInit(): void {
  }



}
