//import { Button } from "antd";
import "@/test.css"
import "@/test1.scss"
import "@/index.less"
import img from "@/1.png"
const test = () => {
	const { x, y } = {x:1,y:2}
	let $dom = document.querySelector('body');
	$dom.innerHTML = `<img src='${img}' title="124"/>`
	// 测试
	console.log(1113);
}
test();
