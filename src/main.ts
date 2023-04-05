import './style.scss'
import gsap from 'gsap'

gsap.fromTo(document.querySelector<HTMLButtonElement>('#counter')!, {
  opacity: 0
},
{
  opacity: 1
})
