import { Component } from '@angular/core';
import { ScheduleOptions } from '@capacitor/local-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { IonicModule } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage {
  private seguridadHabilitada: boolean = false;
  private registrosSubscription: any;  // Variable para almacenar la suscripción a registros

  constructor(public database: AngularFireDatabase) {
          this.iniciarLecturaRegistros();
  }

  // Esta función se llama cuando cambia el estado del toggle
  onToggleChange(event: any) {
    this.seguridadHabilitada = event.detail.checked;

    if (this.seguridadHabilitada) {
      // Si la seguridad se habilita, inicia la lectura de registros
      this.iniciarLecturaRegistros();
    } else {
      // Si la seguridad se deshabilita, detiene la lectura de registros y muestra un mensaje de advertencia
      this.detenerLecturaRegistros();
      console.log('La seguridad está deshabilitada. No se leerán registros ni se enviarán notificaciones.');
    }
  }

  // Esta función inicia la lectura de registros desde Firebase
  private iniciarLecturaRegistros() {
    const path = 'sensor';
    this.registrosSubscription = this.database.list(path).valueChanges().subscribe(
      (res: any[]) => {
        if (res && res.length > 0) {
          const sensorValue = res[0];
          console.log('mediciones ->', sensorValue);
          if (sensorValue === 0) {
            // Si el valor del sensor es 0, programa una notificación
            this.scheduleNotification();
          }
        } else {
          console.warn('No se encontraron registros.');
        }
      },
      error => {
        console.error('Error al leer registros:', error);
      }
    );
  }

  // Esta función detiene la lectura de registros al cancelar la suscripción
  private detenerLecturaRegistros() {
    if (this.registrosSubscription) {
      this.registrosSubscription.unsubscribe();
    }
  }

  // Esta función programa una notificación local
  private scheduleNotification() {
    const options: ScheduleOptions = {
      notifications: [
        {
          id: 111,
          title: '¡Alerta!',
          body: 'La puerta del garaje ha sido ABIERTA',
          largeBody: 'Han abierto la puerta del garaje, llama a la policía!',
          summaryText: 'Ten cuidado'
        }
      ]
    };

    LocalNotifications.schedule(options).then(
      () => console.log('Llama notificación'),
      (ex) => console.error('Error al programar notificación:', ex)
    );
  }
}