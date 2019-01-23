最近项目中用到了3D模型演示的问题，3D 框架有老牌引擎 Three.js 和微软的 Babylon.js 
![image](https://i.loli.net/2018/10/30/5bd7fe1837612.jpg)
对比一下还是使用更为普遍的Three.js 
###  Three.js基础概念   
[主要来自于《Three.js开饭指南》](https://book.douban.com/subject/26349497/)也可以参考在线网站[threejs教程
](https://teakki.com/p/58a3ef1bf0d40775548c908f)
#### 3个基础概念：场景（scene）、相机（camera）和渲染器（renderer）。
- Sence 场景:场景是一个载体，容器，所有的一切都运行在这个容器里面（存放着所有渲染的物体和使用的光源）


- 相机camera的作用是定义可视域，相当于我们的双眼，生产一个个快照，最为常用的是 PerspectiveCamera 透视摄像机，其他还有ArrayCamera 阵列摄像机（包含多个子摄像机，通过这一组子摄像机渲染出实际效果，适用于 VR 场景），CubeCamera 立方摄像机（创建六个 PerspectiveCamera（透视摄像机），适用于镜面场景），StereoCamera 立体相机（双透视摄像机适用于 3D 影片、视差效果）。相机主要分为两类正投影相机和透视相机，正投影相机的话， 所有方块渲染出来的尺寸都一样； 对象和相机之间的距离不会影响渲染结果，而透视相机接近真实世界，看物体会产生远近高低各不同
- PerspectiveCamera 透视摄像机--模拟人眼的视觉，根据物体距离摄像机的距离，近大远小

![image](https://i.loli.net/2018/10/30/5bd81007eac5f.jpg)

- 渲染器renderer则负责用如何渲染出图像，是使用WegGL还是Canvas，类似于react中render，产生实际的页面效果


#### 其他一些概念
- Mesh 网格：有了场景和摄像头就可以看到 3D 场景中的物体，场景中的我们最为常用的物体称为网格。网格由两部分组成：几何体和材质
- 材料（Materials），纹理（ Textures）：物体的表面属性可以是单纯的颜色，也可以是很复杂的情况，比如反射/透射/折射的情况，还可以有纹理图案。比如包装盒外面的贴图。
- Geometry 几何形状：threejs使用Geometry定义物体的几何形状，其实Geometry的核心就是点集，之所以有这么多的Geometry，是为了更方便的创建各种形状的点集
- 光照（Lights）：组成部分。 如果 没有 光源， 我们 就不 可能 看到 任何 渲染 结果，具体介绍可以查看[光照效果和Phong光照模型](http://techbrood.com/zh/news/html5/webgl%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B6---%E5%85%89%E7%85%A7%E6%95%88%E6%9E%9C%E5%92%8Cphong%E5%85%89%E7%85%A7%E6%A8%A1%E5%9E%8B_2.html)。一些常用的光源：
    1. AmbientLight 环境光源，属于基础光源，为场景中的所有物体提供一个基础亮度。
    2. DirectionalLight 平行光源:类似太阳光，发出的光源都是平行的
    3. HemisphereLight 半球光源:只有圆球的半边会发出光源。
    4. PointLight 点光源:一个点向四周发出光源，一般用于灯泡。
    5. SpotLight 聚光灯光源:一个圆锥体的灯光
- 注意:并不是每一种光源都能产生阴影(Shadow):DirectionalLight, PointLight, SpotLight三种能产生阴影，另外如要开启模型的阴影的话，模型是由多个 Mesh 组成的，只开启父的 Mesh 的阴影是不行的，还需要遍历父 Mesh 下所有的子 Mesh 为其开启投射阴影 castShadow 和接收投射阴影 receiveShadow。
- 加载器(Loaders)：用来解析的导入的模型文件，常见的有OBJLoader（加载.obj文件）、JSONLoader,MTLLoader

```
// 场景是所有物体的容器
var scene = new THREE.Scene();
// 相机，相机决定了场景中那个角度的景色会显示出来。相机就像人的眼睛一样，人站在不同位置，抬头或者低头都能够看到不同的景色。
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// 渲染器renderer的domElement元素，表示渲染器中的画布，所有的渲染都是画在domElement上的
var renderer = new THREE.WebGLRenderer();	// 渲染器
renderer.setSize(window.innerWidth, window.innerHeight);
// 设置渲染器的大小为窗口的内宽度，也就是内容区的宽度
document.body.appendChild(renderer.domElement);


// 渲染循环
function animate() {
render();
// 调用requestAnimationFrame函数，传递一个callback参数，则在下一个动画帧时，会调用callback这个函数。
requestAnimationFrame( animate );
}


动画方案：
一：改变camera
function animation()
            {
                //renderer.clear();
                camera.position.x =camera.position.x +1;
                renderer.render(scene, camera);
                requestAnimationFrame(animation);
            }
            
// camera.position.x =camera.position.x +1;
// 将相机不断的沿着x轴移动1个单位，也就是相机向右移动,那么相机中物体是向左移动的。
// 调用requestAnimationFrame(animation)函数，这个函数又会在下一个动画帧出发animation()函数，这样就不断改变了相机的位置，从而物体看上去在移动了。
// 另外，必须要重视render函数，这个函数是重新绘制渲染结果，如果不调用这个函数，那么即使相机的位置变化了，但是没有重新绘制，仍然显示的是上一帧的动画  renderer.render(scene, camera);

二：改变物体自身位置--mesh
mesh就是指的物体，它有一个位置属性position，这个position是一个THREE.Vector3类型变量，所以你要把它向左移动，只需要将x的值不断的减少就可以了。这里我们减去的是1个单位。

// [渲染真实性---光源运用](http://www.hewebgl.com/article/getarticle/60)

THREE.Light ( hex )

它有一个参数hex，接受一个16进制的颜色值。例如要定义一种红色的光源，我们可以这样来定义：

Var redLight = new THREE.Light(0xFF0000);

// [文理--3D物体的皮肤：](http://www.hewebgl.com/article/getarticle/68)
纹理类由THREE.Texture表示，其构造函数如下所示：

THREE.Texture( image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy )
```
一下就是Three.js的基本概念
![image](https://i.loli.net/2018/10/30/5bd83e2119d6d.png)

然后给出一个简单的例子

```
// 引入 Three.js 库
<script src="https://unpkg.com/three"></script>
function init () {
    // 获取浏览器窗口的宽高，后续会用
    var width = window.innerWidth
    var height = window.innerHeight
    // 创建一个场景
    var scene = new THREE.Scene()
    // 创建一个具有透视效果的摄像机
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 800)
    // 设置摄像机位置，并将其朝向场景中心
    camera.position.x = 10
    camera.position.y = 10
    camera.position.z = 30
    camera.lookAt(scene.position)
    // 创建一个 WebGL 渲染器，Three.js 还提供 <canvas>, <svg>, CSS3D 渲染器。
    var renderer = new THREE.WebGLRenderer()
    // 设置渲染器的清除颜色（即背景色）和尺寸。
    // 若想用 body 作为背景，则可以不设置 clearColor，然后在创建渲染器时设置 alpha: true，即 new THREE.WebGLRenderer({ alpha: true })
    renderer.setClearColor(0xffffff)
    renderer.setSize(width, height)
    // 创建一个长宽高均为 4 个单位长度的立方体（几何体）
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
    // 创建材质（该材质不受光源影响）
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000
    })
    // 创建一个立方体网格（mesh）：将材质包裹在几何体上
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    // 设置网格的位置
    cube.position.x = 0
    cube.position.y = -2
    cube.position.z = 0
    // 将立方体网格加入到场景中
    scene.add(cube)
    // 将渲染器的输出（此处是 canvas 元素）插入到 body 中
    document.body.appendChild(renderer.domElement)
    // 渲染，即摄像机拍下此刻的场景
    renderer.render(scene, camera)
}
init()
```
在线的例子[点击](https://codepen.io/JChehe/pen/YxvXOe/)

### 实际运用
#### [three性能监视器stats](http://github.com/mrdoob/stats.js)
主要是用来显示性能帧数的

- FPS：最后一秒的帧数，越大越流畅

- MS：渲染一帧需要的时间（毫秒），越低越好

- MB：占用的内存信息

- CUSTOM：自定义面板
![image](https://i.loli.net/2018/10/30/5bd82a6964f71.jpg)

```
var stats = new Stats()
stats.showPanel(1)
document.body.appendChild(stats.dom)
function animate() {
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)
```


#### 具体一些不用导入的例子
可以在 https://github.com/mrdoob/three.js 下载文件，查看\three.js-master\examples中例子熟悉相应的代码

#### 导入3D模型例子
##### 导入模型类型介绍
导入模型文件需要用到相应的loader，常用[3d软件导出的格式](https://blog.csdn.net/u012088576/article/details/77886947)，项目中主要是用了OBJ和MTL类型，OBJ定义了几何体，MTL定义了材质

```
//当mtl中引用了dds类型的图片时，还需导入DDSLoader文件。
//这里的src路径视实际开发而定
<script src="js/loaders/DDSLoader.js"></script>
<script src="js/loaders/MTLLoader.js"></script>
<script src="js/loaders/OBJLoader.js"></script>
 
 
THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
 
var mtlLoader = new THREE.MTLLoader();
//设置路径，也可不是设置，在load中加载完整路径也可
    mtlLoader.setPath( 'obj/male02/' );
    mtlLoader.load( 'male02_dds.mtl', 
 // 资源加载成功后执行的函数 
 //@params materials THREE.MTLLoader.MaterialCreator
function( materials ) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'obj/male02/' );
        objLoader.load( 'male02.obj', function ( object ) {
    		object.position.y = - 95;
    		scene.add( object );
    	});
});
```

具体例子可以查看

##### 导入OBJ存在问题，模型导出为obj格式后，文件太大（放在服务器就会产生严重的性能问题），而且还需要额外对MTL导入，不然只会显示几何模型

##### glTF 模型格式
.obj 是静态模型，不支持动画数据存储，无法使用模型的动画，而且体积大，
glTF 是由 Khronos Group 开发的 3D 模型文件格式，该格式的特点是最大程度的减少了 3D 模型文件的大小，提高了传输、加载以及解析 3D 模型文件的效率，并且它可扩展，可互操作。

.gltf包含场景中节点层次结构、摄像机、网格、材质以及动画等描述信息

Three.js 中使用 glTF 格式需额外引入 GLTFLoader.js 加载器。

```
var gltfLoader = new THREE.gltfLoader()
gltfLoader.load('./assets/box.gltf', function(sence) {
  var object = scene.gltf // 模型对象
  scene.add(object) // 将模型添加到场景中
})
```
glTF 模型中可以使用 Blender 建模软件制作动画，导出后使用 GLTFLoader 加载到 Three.js 中，可以拿到一个 animations 数组，animations 里包含了模型的每个动画 Action 动作。

为了获取更好的网络性能，还可以使用[Draco](https://codelabs.developers.google.com/codelabs/draco-3d/index.html#0)工具进行压缩，只有在模型文件很多时，才推荐压缩（因为压缩后格式改变，需要引入其他的解析工具）
#### 动画
上面说到了动画，关于动画，可以直接三方库Tween 动画，在许睿提供的研究里面有相关的运用。一般在Three.js动画是使用[requestAnimationFrame()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame),当你需要更新屏幕画面时就可以调用此方法。在浏览器下次重绘前执行回调函数。回调的次数通常是每秒60次。

对模型实现淡入淡出、缩放、位移、旋转等动画推荐使用[ GSAP ](https://greensock.com/gsap?product=gsap)来实现更为简便。


```
let tween = new TimelineMax()
tween
  .to(box.scale, 1, { // 从 1 缩放至 2，花费 1 秒
    x: 2,
    y: 2,
    z: 2,
    ease: Power0.easeInOut, // 速度曲线
    onStart: function() {
      // 监听动画开始
    },
    onUpdate: function() {
      // 监听动画过程
    },
    onComplete: function() {
      // 监听动画结束
    }
  })
  .to(box.position, 1, { // 缩放结束后，位移 x 至 10，花费 1 秒
    x: 10,
    y: 0,
    z: 0
  })
```
#### 控制orbitcontrols
场景控制器，OrbitControls 是用于调试 Camera 的方法，实例化后可以通过鼠标拖拽来旋转 Camera 镜头的角度，鼠标滚轮可以控制 Camera 镜头的远近距离，旋转和远近都会基于场景的中心点，在调试预览则会轻松许多。

```
// 引入文件
<script src="js/OrbitControls.js"></script>
    
 //场景控制器初始化
    function initControls() {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enabled = true; // 鼠标控制是否可用

      // 是否自动旋转
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.05;

      //是否可旋转，旋转速度(鼠标左键)
      controls.enableRotate = true;
      controls.rotateSpeed = 0.3;

      //controls.target = new THREE.Vector();//摄像机聚焦到某一个点
      //最大最小相机移动距离(景深相机)
      controls.minDistance = 10;
      controls.maxDistance = 40;

      //最大仰视角和俯视角
      controls.minPolarAngle = Math.PI / 4; // 45度视角
      controls.maxPolarAngle = Math.PI / 2.4; // 75度视角

      //惯性滑动，滑动大小默认0.25
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;

      //是否可平移，默认移动速度为7px
      controls.enablePan = true;
      controls.panSpeed = 0.5;
      //controls.screenSpacePanning	= true;

      //滚轮缩放控制
      controls.enableZoom = true;
      controls.zoomSpeed = 1.5;

      //水平方向视角限制
      //controls.minAzimuthAngle = -Math.PI/4;
      //controls.maxAzimuthAngle = Math.PI/4;
    }
```

#### 点击交互
在3D模型中，鼠标点击是重要的交互。对于 Three.js，它没有类似 DOM 的层级关系，并且处于三维环境中，那么我们则需要通过以下方式来判断某对象是否被选中。


```
function onDocumentMouseDown(event) {
    // 点击位置创建一个 THREE.Vector3 向量
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    // vector.unproject 方法将屏幕上的点击位置转换成 Three.js 场景中的坐标
    vector = vector.unproject(camera);
    // 使用 THREE.Raycaster 可以向场景中发射光线
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    // 使用 raycaster.intersectObjects 方法来判断指定的对象中哪些被该光线照射到的,
    // 从而显示不同的颜色
    var intersects = raycaster.intersectObjects([sphere, cylinder, cube]);
    if (intersects.length > 0) {
        console.log(intersects[0]);
        // 点击后改变透明度
        intersects[0].object.material.transparent = true;
        intersects[0].object.material.opacity = 0.1;
        
        <!--...... 在这里可以实现你所需要的交互-->
    }
}
```


### react中实践运用

```
// 引入相关的依赖
npm i -S three


<!--GisThree.js-->


import React, { Component, Fragment } from 'react';
import './GisThree.less';
import OBJLoader from './threejsLibs/OBJLoader';
import Orbitcontrols from './threejsLibs/OrbitControls';
import MTLLoader from './threejsLibs/MTLLoader_module';
import { Icon } from 'antd';

import exhibitObj from './modal/exhibit2.obj';
import exhibitMtl from './modal/exhibit2.mtl';

let THREE = require('three');
Orbitcontrols(THREE);
OBJLoader(THREE);
MTLLoader(THREE);

// 排除这些名字的3D模型
const objectArrName = [ "房屋1101", "房屋1150", "房屋600", "房屋70", "房屋45", "房屋362", "房屋363", "房屋364", "房屋500" ];

class GisThree extends Component {

  constructor( props ) {
    super(props);
    this.state = {
      isModel: false,
      currentName: '暂无名字',
      clientX: 0,
      clientY: 0
    };
    this.threeRef = React.createRef();
  }

  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // todo 初始化场景
    const scene = new THREE.Scene();
    // todo 加载相机
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 80);
    camera.position.set(0, 25, 25);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //todo 加载光线
    const ambLight = new THREE.AmbientLight(0x404040, 0.5);
    const pointLight = new THREE.PointLight(0x404040, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    pointLight.position.set(100, 10, 0);
    pointLight.receiveShadow = true;
    scene.add(ambLight);
    scene.add(pointLight);
    scene.add(directionalLight);

    //todo  renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(width, height - 10);
    //renderer.setClearColor(0xb9d3ff,1);
    renderer.setClearColor(0x000000, 1.0);

    //todo  加载模型model
    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(exhibitMtl,
      function ( materials ) {
        console.log('sdj exhibit.obj', materials)
        materials.preload();
        let objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(exhibitObj, function ( object ) {
          console.log('sdj exhibit.obj')
          console.log('sdj exhibit.obj object', object);

          for ( let i = 0; i < object.children.length; i++ ) {
            let material = object.children[ i ].material;
            let meshObj = new THREE.Mesh(object.children[ i ].geometry, material);
            meshObj.receiveShadow = true;
            meshObj.castShadow = true;
            meshObj.scale.set(0.02, 0.02, 0.02);
            meshObj.name = "房屋" + i;
            meshObj.position.x = 0;
            meshObj.position.y = 0;
            meshObj.position.z = -20;

            scene.add(meshObj);
          }
        });
      }
    );

    // todo 场景控制器初始化
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = true; // 鼠标控制是否可用

    // 是否自动旋转
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.05;

    //是否可旋转，旋转速度(鼠标左键)
    controls.enableRotate = true;
    controls.rotateSpeed = 0.3;

    //controls.target = new THREE.Vector();//摄像机聚焦到某一个点
    //最大最小相机移动距离(景深相机)
    controls.minDistance = 10;
    controls.maxDistance = 40;

    //最大仰视角和俯视角
    controls.minPolarAngle = Math.PI / 4; // 45度视角
    controls.maxPolarAngle = Math.PI / 2.4; // 75度视角

    //惯性滑动，滑动大小默认0.25
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    //是否可平移，默认移动速度为7px
    controls.enablePan = true;
    controls.panSpeed = 0.5;
    //controls.screenSpacePanning	= true;

    //滚轮缩放控制
    controls.enableZoom = true;
    controls.zoomSpeed = 1.5;

    //水平方向视角限制
    //controls.minAzimuthAngle = -Math.PI/4;
    //controls.maxAzimuthAngle = Math.PI/4;

    //todo 绑定到类上
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    //鼠标移入和移出事件高亮显示选中的模型
    this.currentObjectColor = null; //移入模型的颜色
    this.currentObject = null; //鼠标移入的模型

    // 初始化场景
    // 加载到dom元素上
    this.threeRef.current.appendChild(this.renderer.domElement)

    this.start();

    window.addEventListener('resize',this.resizeFunc1 ,false);
    window.addEventListener('resize',this.resizeFunc2 ,false);
  }

  componentWillUnmount() {
    this.stop();
    this.threeRef.current.removeChild(this.renderer.domElement);
    window.removeEventListener('resize',this.resizeFunc1 ,false);
    window.removeEventListener('resize',this.resizeFunc2 ,false);
  }

  // 初始化
  start = () => {
    if(!this.frameId){
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  // 卸载组件的时候去除
  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  // 更新状态
  animate = () => {
    this.controls.update();
    this.renderScene();
    this.frameId = requestAnimationFrame(this.animate);
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }

  // 是否展示弹窗
  changeModel = ( e ) => {
    e.stopPropagation();
    this.setState({
      isModel: !this.state.isModel
    })
  }

  closeModel = ( e ) => {
    e.stopPropagation();
    if (this.controls && !this.controls.autoRotate){
      this.controls.autoRotate = true;
    }
    this.setState({
      isModel: false
    })
  }

  // 点击3D模型匹配
  mouseClick = (e) => {
    // 鼠标坐标映射到三维坐标
    e.preventDefault();
    const that = this;
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    if(!this.camera || !this.scene) return;
    let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(this.camera);
    let raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
    let intersects = raycaster.intersectObjects(this.scene.children, true); //选中的三维模型
    console.log('sdj position',intersects)
    if (intersects.length > 0) {
      let SELECTED = intersects[0];
      let currentName = SELECTED.object.name;
      console.log('sdj position', e.clientX, e.clientY, e.screenX, e.screenY);
      if (objectArrName.indexOf(currentName) == -1) {
        if (this.controls.autoRotate){
          this.controls.autoRotate = false;
        }
        that.changeModel(e);
        that.setState({
          currentName,
          clientX: e.clientX,
          clientY: (e.clientY - 60)
        })
        console.log("你选中的物体的名字是：" + currentName);
      }
    }
  }

  // 鼠标聚焦
  mouseenterObject = (e) => {
    // 鼠标坐标映射到三维坐标
    e.preventDefault();

    let mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(this.camera);
    let raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
    let intersects = raycaster.intersectObjects(this.scene.children, true); //选中的三维模型
    if (!intersects.length && this.currentObjectColor && this.currentObject) { //从模型处移到外面
      this.currentObject.object.material.color.setHex(this.currentObjectColor);
      this.currentObjectColor = null;
      this.currentObject = null;
    }
    if (intersects.length > 0) {
      let SELECTED = intersects[0];
      let currentName = SELECTED.object.name;
      if (objectArrName.indexOf(currentName) == -1) {
        if (this.currentObject && currentName === this.currentObject.object.name) {
          return;
        }
        if (this.currentObjectColor && this.currentObject && currentName !== this.currentObject.object.name) { //color值是一个对象
          this.currentObject.object.material.color.setHex(this.currentObjectColor);
        }
        this.currentObject = SELECTED;
        this.currentObjectColor = SELECTED.object.material.color.getHex();
        SELECTED.object.material.color.set(0x74bec1);
      } else {
        if (this.currentObjectColor && this.currentObject && currentName !== this.currentObject.object.name) { //color值是一个对象
          this.currentObject.object.material.color.setHex(this.currentObjectColor);
        }
        this.currentObjectColor = null;
        this.currentObject = null;
      }
    }
  }

  resizeFunc1 = () => {
    this.controls.update();
  }

  resizeFunc2 = (e) =>  {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    return (
      <Fragment>
        <div
          className={ this.props.className || 'three-component' }
          id="d3"
          ref={ this.threeRef }
          onClick={this.mouseClick}
          onMouseMove={this.mouseenterObject}
        />
        {
          this.state.isModel && (
            <div
              className="three-modal"
              style={ {
                top: this.state.clientY,
                left: this.state.clientX
              } }
            >
              <Icon
                className="three-modal-close"
                type="close" theme="outlined"
                onClick={ this.closeModel }
              />
              <ul>
                <li>
                  <span className="modal-title">出租屋编码</span>
                  <span className="modal-data">{ this.state.currentName }</span>
                </li>
                <li>
                  <span className="modal-title">地址</span>
                  <span className="modal-data">社区一号</span>
                </li>
                <li>
                  <span className="modal-title">每层楼栋数</span>
                  <span className="modal-data">6</span>
                </li>
                <li>
                  <span className="modal-title">层数</span>
                  <span className="modal-data">16</span>
                </li>
              </ul>
            </div>
          )
        }
      </Fragment>
    )
  }
}

export default GisThree;


```


在服务器出现的错误，而本地服务器没有问题
参考 https://stackoverflow.com/questions/48311840/import-local-obj-to-load-with-three-js-objloader-using-react
```
objLoader.js:624 Uncaught Error: THREE.OBJLoader: Unexpected line: "<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"><meta name="theme-color" content="#000000"><link rel="manifest" href="/manifest.json"><link rel="shortcut icon" href="/favicon.ico"><title>智慧社区_管理后台</title><link href="/static/css/main.bdb0e864.css" rel="stylesheet"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div><script src="/config.js"></script><script type="text/javascript" src="/static/js/charts.24f90613.js"></script><script type="text/javascript" src="/static/js/vendor.0b9068d0.js"></script><script type="text/javascript" src="/static/js/main.cfa93993.js"></script></body></html>"
    at OBJLoader.parse (objLoader.js:624)
    at objLoader.js:385
    at XMLHttpRequest.<anonymous> (three1.js:630)




objLoader.js:624 Uncaught Error: THREE.OBJLoader: Unexpected line: "<!doctype html>"
    at OBJLoader.parse (objLoader.js:624)
    at objLoader.js:385
    at XMLHttpRequest.<anonymous> (three1.js:630)
```
最后发现弃用mtl-loader之后（且升级到webpack4）正确显示了材质，以及出现了git忽略了.obj问题，看[博客](https://blog.csdn.net/lingyanpi/article/details/71724282)，全局的gitignore_global.txt中忽略了.obj问题，好坑！！！

### 参考：
1. [入门--Three.js 现学现卖](https://aotu.io/notes/2017/08/28/getting-started-with-threejs/index.html)
2. [threejs官方文档](https://threejs.org/docs/#manual/zh/introduction/Creating-a-scene)
3. [Three.js 中文教程](http://techbrood.com/threejs/docs/)
4. [1.orbit controls插件](http://www.php.cn/js-tutorial-379403.html)  ---[2.详解](https://blog.csdn.net/u013270347/article/details/81078155)
5. [3D模型导入](https://blog.csdn.net/u012088576/article/details/77886947)
6. [react three.js](https://blog.csdn.net/future_todo/article/details/78072615)
7. [首个threejs项目-前端填坑指南 主要介绍了C4D转json  以及一些动画模型注意点](http://www.cnblogs.com/pursues/p/5226807.html)
8. [【Three.js】OrbitControl 旋转插件](http://www.cnblogs.com/hundan/p/3614542.html?utm_source=tuicool&utm_medium=referral#undefined)
9. [读取blender模型并导入动画](https://blog.csdn.net/orangecsy/article/details/80807924)
10. [十分钟打造 3D 物理世界](https://aotu.io/notes/2018/10/18/cannonjs/)