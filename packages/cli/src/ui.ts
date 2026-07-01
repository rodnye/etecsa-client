import chalk from 'chalk';
import Table from 'cli-table3';
import {
  GetServiceStatusResponse,
  PrepaidServiceStatus,
  ProfileData,
} from '@rodny/etecsa-core';

export function printMobileStatus(status: GetServiceStatusResponse) {
  const table = new Table({
    head: [chalk.cyan('Concepto'), chalk.cyan('Detalle')],
    colWidths: [25, 45],
    style: { head: [], border: [] },
  });

  const formatData = (val: string | undefined) =>
    val && val !== '0' ? val : chalk.gray('N/A');

  if (status.tipolinea === 'prepago')
    table.push(
      ['Número', chalk.bold(status.numero)],
      ['Tipo de Línea', status.tipolinea.toUpperCase()],
      ['Saldo', chalk.green(status.balance)],
      [
        'Datos',
        formatData(status.datos || status.datosLTE || status.paquete4g),
      ],
      ['Datos Nacionales', formatData(status.bonoDatosNacionales)],
      ['Voz', formatData(status.voz)],
      ['SMS', formatData(status.sms)],
      ['Expira', status.fexpiracion || chalk.gray('N/A')],
    );
  else {
    // TODO: terminar los demás tipos de linea
    throw new Error('Tipo de linea: ' + status.tipolinea + ' no implementado');
  }

  console.log('\n' + table.toString() + '\n');
}

export function printProfile(profile: ProfileData) {
  const user = profile.usuario;
  const table = new Table({
    head: [chalk.cyan('Campo'), chalk.cyan('Valor')],
    colWidths: [25, 45],
    style: { head: [], border: [] },
  });

  table.push(
    [
      'Nombre Completo',
      `${user.nombre} ${user.primer_apellido} ${user.segundo_apellido || ''}`,
    ],
    ['Carnet', user.carnet],
    ['Email', user.email],
    ['Móvil', user.movil],
    ['Dirección', user.direccion],
    ['Provincia/Municipio', `${user.provincia} / ${user.municipio}`],
  );

  console.log('\n' + table.toString() + '\n');
}

export function extractAndPrintField(obj: any, path: string) {
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  if (value === undefined || value === null) {
    console.log(chalk.yellow(`Campo '${path}' no encontrado o vacío.`));
  } else if (typeof value === 'object') {
    console.log(JSON.stringify(value, null, 2));
  } else {
    console.log(value);
  }
}
