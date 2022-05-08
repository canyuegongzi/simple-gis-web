let draging = false;
let dragDom: HTMLElement | null;
let dragpoint: { x: number, y: number };
function handleMouseUp() {
    draging = false;
    dragDom = null;
}
function handleMousemove(ev: MouseEvent) {
    if (draging) {
        let _dragdom = dragDom as HTMLElement;
        let sty = window.getComputedStyle(_dragdom, null);
        _dragdom.style.marginLeft = `${parseFloat(sty.marginLeft) + ev.clientX - dragpoint.x}px`;
        _dragdom.style.marginTop = `${parseFloat(sty.marginTop) + ev.clientY - dragpoint.y}px`;
        dragpoint = {
            x: ev.clientX,
            y: ev.clientY
        }
    }
}
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', handleMousemove);
function bind(el: HTMLElement) {

    let dialogHeaderEl = el.querySelector('.el-dialog__header') as HTMLElement;
    dialogHeaderEl.addEventListener('mousedown', (ev: MouseEvent) => {
        let target = ev.target as HTMLElement;
        if (target.classList.contains('el-dialog__close')) {
            return;
        }
        draging = true;
        dragDom = el;
        dragpoint = {
            x: ev.clientX,
            y: ev.clientY
        }
    });
}
export default {
    bind
}
