import Vue from 'vue';

// 自定义元素实现弹框拖拽[重点]
Vue.directive('draw', {

    inserted: function(el, binding, vNode) {
        el.setAttribute('style', 'position: fixed; z-index: 9999');
    },

    bind: function(el, bindding, vNode) {
        el.setAttribute('draggable', true);
        let left, top, width, height;
        el._dragstart = function(event) {
            event.stopPropagation();
            left = event.clientX - el.offsetLeft;
            top = event.clientY - el.offsetTop;
            width = el.offsetWidth;
            height = el.offsetHeight;
        };
        el._checkPosition = function() { // 防止被拖出边界
            let width = el.offsetWidth;
            let height = el.offsetHeight;
            let left = Math.min(el.offsetLeft, document.body.clientWidth - width);
            left = Math.max(0, left);
            let top = Math.min(el.offsetTop, document.body.clientHeight - height);
            top = Math.max(0, top);
            el.style.left = left + 'px';
            el.style.top = top + 'px';
            //el.style.width = width + 'px';
            //el.style.height = height + 'px';
        };
        el._dragEnd = function(event) {
            event.stopPropagation();
            left = event.clientX - left;
            top = event.clientY - top;
            el.style.left = left + 'px';
            el.style.top = top + 'px';
            //el.style.width = width + 'px';
            //el.style.height = height + 'px';
            el._checkPosition();
        };
        el._documentAllowDraop = function(event) {
            event.preventDefault();
        };
        document.body.addEventListener('dragover', el._documentAllowDraop);
        el.addEventListener('dragstart', el._dragstart);
        el.addEventListener('dragend', el._dragEnd);
        window.addEventListener('resize', el._checkPosition);
    },

    unbind: function(el, bindding, vNode) {
        document.body.removeEventListener('dragover', el._documentAllowDraop);
        el.removeEventListener('dragstart', el._dragstart);
        el.removeEventListener('dragend', el._dragEnd);
        window.removeEventListener('resize', el._checkPosition);
        delete el._documentAllowDraop;
        delete el._dragstart;
        delete el._dragEnd;
        delete el._checkPosition;
    },
});

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        const dragDom = el.querySelector('.el-dialog');
        dialogHeaderEl.style.cursor = 'move';

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

        dialogHeaderEl.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            const disY = e.clientY - dialogHeaderEl.offsetTop;

            // 获取到的值带px 正则匹配替换
            let styL, styT;

            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (sty.left.includes('%')) {
                styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
            } else {
                styL = +sty.left.replace(/\px/g, '');
                styT = +sty.top.replace(/\px/g, '');
            }

            document.onmousemove = function(e) {
                // 通过事件委托，计算移动的距离
                const l = e.clientX - disX;
                const t = e.clientY - disY;

                // 移动当前元素
                dragDom.style.left = `${l + styL}px`;
                dragDom.style.top = `${t + styT}px`;

                // 将此时的位置传出去
                // binding.value({x:e.pageX,y:e.pageY})
            };

            document.onmouseup = function(e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    },
});

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
    bind(el, binding, vnode, oldVnode) {
        const dragDom = binding.value.$el.querySelector('.el-dialog');

        el.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - el.offsetLeft;

            document.onmousemove = function(e) {
                e.preventDefault(); // 移动时禁用默认事件

                // 通过事件委托，计算移动的距离
                const l = e.clientX - disX;
                dragDom.style.width = `${l}px`;
            };

            document.onmouseup = function(e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    },
});
