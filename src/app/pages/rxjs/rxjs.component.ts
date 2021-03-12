import { Component, OnDestroy} from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})

 /*Nos suscribimos para poder usar el resultado*/
   /*  this.retornaObservable().pipe(
      retry()
      ).subscribe(
      valor => console.log( 'Subs:', valor ),
      error => console.warn('Error:', error ),
      () => console.log('Obs terminado')
    ); */
    
export class RxjsComponent implements OnDestroy{

  public intervalSubs: Subscription;
  constructor() {

    this.intervalSubs = this.retornaIntervalo().subscribe( console.log );

  }

  ngOnDestroy(){
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number>{
    return interval(500)
            .pipe(
              map( valor => valor + 1),
              filter( valor => ( valor % 2 === 0 ) ? true : false),
             /*  take(10), */
);
  }


  retornaObservable(): Observable<number>{
    let i = -1;
    return new Observable<number>( observer => {
      const intervalo = setInterval (() => {
        i++;
        /* Proximo valor*/
        observer.next(i);
        if ( i === 4 ){
          /* cancelamos interval y terminamos observable*/
          clearInterval( intervalo );
          observer.complete();
        }
        if ( i === 2){
          /*Se termina el observable*/
          observer.error('i llego al valor de 2')
        }
      } , 1000 );
    });
  }
}
