//Varables
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const objBusqueda = 
{
    moneda: '',
    criptomoneda : ''
}
//crear promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>
    {
        resolve(criptomonedas);
    })
    //capturo los eventos al cargar la paginas
document.addEventListener('DOMContentLoaded', ()=>
{
    consultarCriptomonedas();
    formulario.addEventListener('submit',submitFormulario);
    criptomonedasSelect.addEventListener('change',leerValor);
    monedaSelect.addEventListener('change',leerValor);
})
function consultarCriptomonedas()
{
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';
    fetch(url)
       .then(respuesta => respuesta.json())
        .then(resultado =>  obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas)) 
               
        

}
function selectCriptomonedas(criptomonedas)
{
    criptomonedas.forEach(cripto =>
        {
            const{FullName,Name} = cripto.CoinInfo;
            const option = document.createElement('option');
            option.value = Name;
            option.textContent = FullName;
            criptomonedasSelect.appendChild(option);
        })
}
function leerValor(e)
{
    objBusqueda[e.target.name] = e.target.value;


}
function submitFormulario(e)
{
    e.preventDefault();
    //validar
    const{moneda,criptomoneda} = objBusqueda; 
    if(moneda === '' || criptomoneda === '')
    {
        mostrarAlerta("ambos campos son obligatorios");
        return;
    }
    //consultar api
    consultarAPI();
}
function mostrarAlerta(mensaje)
{
    //create div Error
    const divError = document.createElement('div');
    //Add classList 
    divError.classList.add('error');
    //Add content
    divError.textContent = mensaje;
    //insert in page
    formulario.appendChild(divError);
    //remove after 3 seconds
    setTimeout(()=>
    {
        divError.remove();
    },3000);
}
function consultarAPI()
{
    //variables 
    const {moneda,criptomoneda} = objBusqueda;
    //guardo url API
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    //mostrar spinner
    mostrarSpinner();
    //consulto API
    fetch(url)
     .then(respuesta => respuesta.json())
     .then(cotizacion =>
        {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}
//muestro la cotizacion de la cryptomoneda 
function mostrarCotizacionHTML(cotizacion)
{
    //limpio el html
    limpiarHTML();
    //destructuring de la informacion a mostrar
   const {PRICE, HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;
   const precio = document.createElement('p');
   precio.classList.add('precio');
   precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

   
   const precioAlto = document.createElement('p');
   precioAlto.innerHTML = `<p>precio más alto del día <span>${HIGHDAY}</span>`;

   const precioBajo = document.createElement('p');
   precioBajo.innerHTML = `<p>precio más bajo del día <span>${LOWDAY}</span>`;

   const ultimasHoras = document.createElement('p');
   ultimasHoras.innerHTML = `<p>Variacion ultimas 24 horas es : <span>${CHANGEPCT24HOUR}</span>`;

   
   
   

   //agrego al HTML 
   resultado.appendChild(precio);
   resultado.appendChild(precioAlto);
   resultado.appendChild(precioBajo);
   resultado.appendChild(ultimasHoras);
}
//limpio el html para que no se repita
function limpiarHTML()
{
    while(resultado.firstChild)
    {
        resultado.removeChild(resultado.firstChild);
    }
}
function mostrarSpinner()
{
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
    
    `;
    resultado.appendChild(spinner);
}