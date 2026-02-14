import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BannerComponent } from './banner.component';

fdescribe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should start with empty default input values', () => {
    fixture.detectChanges();

    expect(component.src).toBe('');
    expect(component.alt).toBe('');
  });

  it('should render image src and alt from @Input values', () => {
    component.src = '/assets/banner-home.png';
    component.alt = 'Banner da home';

    fixture.detectChanges();

    const image: HTMLImageElement = fixture.debugElement.query(
      By.css('img'),
    ).nativeElement;

    expect(image.getAttribute('src')).toBe('/assets/banner-home.png');
    expect(image.getAttribute('alt')).toBe('Banner da home');
  });

  it('should update rendered img attributes when input values change', () => {
    component.src = '/assets/banner-old.png';
    component.alt = 'Old description';
    fixture.detectChanges();

    component.src = '/assets/banner-new.png';
    component.alt = 'New description';
    fixture.detectChanges();

    const image: HTMLImageElement = fixture.debugElement.query(
      By.css('img'),
    ).nativeElement;

    expect(image.getAttribute('src')).toBe('/assets/banner-new.png');
    expect(image.getAttribute('alt')).toBe('New description');
  });

  it('should render exactly one figure and one image element', () => {
    fixture.detectChanges();

    const figures = fixture.debugElement.queryAll(By.css('figure'));
    const images = fixture.debugElement.queryAll(By.css('figure img'));

    expect(figures.length).toBe(1);
    expect(images.length).toBe(1);
  });

  it('should not keep a raw javascript URL in src (sanitization regression guard)', () => {
    component.src = 'javascript:alert(1)';
    component.alt = 'Possibly unsafe source';

    fixture.detectChanges();

    const image: HTMLImageElement = fixture.debugElement.query(
      By.css('img'),
    ).nativeElement;
    const renderedSrc = image.getAttribute('src');

    expect(renderedSrc).not.toBe('javascript:alert(1)');
  });

  it('should not render "undefined" text when nullable values are assigned (regression guard)', () => {
    (
      component as unknown as {
        src: string | undefined;
        alt: string | undefined;
      }
    ).src = undefined;
    (
      component as unknown as {
        src: string | undefined;
        alt: string | undefined;
      }
    ).alt = undefined;

    fixture.detectChanges();

    const image: HTMLImageElement = fixture.debugElement.query(
      By.css('img'),
    ).nativeElement;
    const renderedSrc = image.getAttribute('src') ?? '';
    const renderedAlt = image.getAttribute('alt') ?? '';

    expect(renderedSrc).not.toContain('undefined');
    expect(renderedAlt).not.toContain('undefined');
  });
});
