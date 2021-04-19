import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string | undefined, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {
    if ( !img ) {
      return `${ base_url }/uploads/${ tipo }/no-img.png`;
    } else if ( img?.includes('https')){
      return img;
    } else if ( img ) {
        return `${ base_url }/uploads/${ tipo }/${ img }`;
    }else {
      return `${ base_url }/uploads/${ tipo }/no-img.png`;
    }
  }
}