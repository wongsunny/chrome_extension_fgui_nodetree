/*
 * @Author: wwx
 * @Date: 2026-01-07 10:56:41
 * @Description: 
 */
(function () {
    //console.log('FairyguiNodeTree - hook THREE.Scene.ctor 111');
    window.__THREE_SCENCE__ = []
    window.__THREE_DEVTOOLS__ = new EventTarget();
    window.__THREE_DEVTOOLS__.addEventListener('observe', e => {
        const obj = e.detail;
        if (obj.isScene && obj !== fgui.Stage.scene) {
            //console.log('捕获 Scene', obj.uuid);
            window.__THREE_SCENCE__.push(obj)
            obj.addEventListener('dispose', () => {
                let length = window.__THREE_SCENCE__.length
                for (let i = length; i >= 0; i--) {
                    let s = window.__THREE_SCENCE__[i]
                    if (obj == s) {
                        window.__THREE_SCENCE__.splice(i, 1)
                    }
                }
            })
        }
    });
    //console.log('FairyguiNodeTree - hook THREE.Scene.ctor 222');
})();