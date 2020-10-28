const userName = 'CYH';

console.log(userName);

const button =  document.querySelector('button')!

if(button){
  button.addEventListener('click', () => {
    console.log('Clicked!');
  })
}

function clickHandler (message: string){
  console.log('Clicked!' + message);
}

if(button){
  button.addEventListener("click", clickHandler.bind(null, "you're welcome"));
}