
const menuButton=document.querySelector(".menu-btn");const nav=document.querySelector(".nav");if(menuButton&&nav){menuButton.addEventListener("click",()=>nav.classList.toggle("open"))}
const form=document.querySelector("#contactForm");const message=document.querySelector("#formMessage");if(form&&message){form.addEventListener("submit",e=>{e.preventDefault();const name=form.elements.name.value.trim();message.textContent=name?`${name}, хабарламаңыз қабылданды. Рақмет!`:"Хабарламаңыз қабылданды. Рақмет!";form.reset()})}
document.querySelectorAll(".year").forEach(i=>{i.textContent=new Date().getFullYear()});
