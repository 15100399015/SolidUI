import * as React from "react";
import Moveable from "react-moveable";
import { getContentElement, getId } from "./index";
import { EditorInterface } from "./types";
import { connectEditorContext } from "../SolidEditorContext";
import { SOLIDUI_ELEMENT_ID } from "./const";
import { OnReiszeGroupEventData } from "@/types/eventbus";
import {
	DimensionViewable,
	DimensionViewableProps,
} from "../ables/DimensionViewable";
import {
	DelteButtonViewable,
	DelteButtonViewableProps,
} from "../ables/DeleteButtonViewable";
import { eventbus, mm } from "@/utils";

@connectEditorContext
export default class MoveableManager extends React.PureComponent<{
	selectedTargets: Array<HTMLElement | SVGElement>;
	selectedMenu: string;
	verticalGuidelines: number[];
	horizontalGuidelines: number[];
	zoom: number;
}> {
	public moveable = React.createRef<Moveable>();
	public getMoveable() {
		return this.moveable.current!;
	}
	public render() {
		const {
			verticalGuidelines,
			horizontalGuidelines,
			selectedTargets,
			selectedMenu = "Text",
			zoom,
		} = this.props;

		if (!selectedTargets.length) {
			return this.renderViewportMoveable();
		}

		const moveableData = this.moveableData;
		const memory = this.memory;

		const elementGuidelines = [
			document.querySelector(".editor-viewport"),
			...moveableData.getTargets(),
		].filter((el) => {
			return selectedTargets.indexOf(el as any) === -1;
		});

		return (
			<Moveable<DimensionViewableProps & DelteButtonViewableProps>
				ables={[DimensionViewable, DelteButtonViewable]}
				ref={this.moveable}
				targets={selectedTargets}
				dimensionViewable={true}
				deleteButtonViewable={true}
				zoom={1 / zoom}
				throttleResize={1}
				passDragArea={selectedMenu === "Text"}
				checkInput={selectedMenu === "Text"}
				// throttleDragRotate={isShift ? 45 : 0}
				// keepRatio={selectedTargets.length > 1 ? true : isShift}
				keepRatio={false}
				// Snapable
				snappable={true}
				bounds={{
					position: "css",
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
				}}
				snapThreshold={5}
				snapGap={true}
				elementGuidelines={elementGuidelines}
				elementSnapDirections={{
					top: true,
					left: true,
					bottom: true,
					right: true,
					center: true,
					middle: true,
				}}
				isDisplaySnapDigit={true}
				isDisplayInnerSnapDigit={true}
				snapDistFormat={(v, type) => {
					return `${v}px`;
				}}
				// Roundable
				roundable={selectedTargets.length > 1 ? false : true}
				roundClickable={false}
				isDisplayShadowRoundControls={true}
				minRoundControls={[1, 0]}
				maxRoundControls={[1, 0]}
				roundRelative={true}
				roundPadding={13}
				onRound={(e) => {
					moveableData.onRound(e);
					e.target.style.borderRadius = e.borderRadius;
				}}
				verticalGuidelines={verticalGuidelines}
				horizontalGuidelines={horizontalGuidelines}
				// Drag
				draggable={true}
				// onDragStart={moveableData.onDragStart}
				onDragStart={(e) => {
					let id = e.target.getAttribute(SOLIDUI_ELEMENT_ID);
					if (null === id || undefined === id) {
						return;
					}
					let view = mm.getView(id);
					if (null === view || undefined === view) {
						return;
					}
					e.set(view.frame.translate);
				}}
				onDrag={(e) => {
					// let deltaX = e.delta[0];
					// let deltaY = e.delta[1];
					// let rect = e.target.getBoundingClientRect();
					// let newLeft = rect.left + deltaX;
					// let newTop = rect.top + deltaY;
					// e.target.style.left = `${newLeft}px`;
					// e.target.style.top = `${newTop}px`;
					let id = e.target.getAttribute(SOLIDUI_ELEMENT_ID);
					if (null === id || undefined === id) {
						return;
					}
					let view = mm.getView(id);
					if (null === view || undefined === view) {
						return;
					}
					// moveableData.onDrag(e);
					view.frame.translate = e.beforeTranslate;
					// frame.translate = e.beforeTranslate;
					// view.position = {
					// 	// top: newTop,
					// 	top: e.beforeTranslate[1],
					// 	// left: newLeft,
					// 	left: e.beforeTranslate[0],
					// };
					e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px) rotate(${view.frame.rotate}deg)`;
				}}
				onDragGroupStart={moveableData.onDragGroupStart}
				onDragGroup={moveableData.onDragGroup}
				onDragOriginStart={moveableData.onDragOriginStart}
				onDragOrigin={(e) => {
					moveableData.onDragOrigin(e);
				}}
				// onDragEnd={(e) => {
				// 	let id = e.target.getAttribute(SOLIDUI_ELEMENT_ID);
				// 	if (null === id || undefined === id) {
				// 		return;
				// 	}
				// 	if (e.lastEvent === null || e.lastEvent === undefined) {
				// 		return;
				// 	}
				// 	let view = mm.getView(id);
				// 	if (null === view || undefined === view) {
				// 		return;
				// 	}

				// 	let translate = e.lastEvent.translate;
				// 	let pos = view.position;
				// 	// let newPos = {
				// 	// 	top: pos.top + translate[1],
				// 	// 	left: pos.left + translate[0],
				// 	// };
				// 	// view.position = newPos;
				// 	view.position = {
				// 		top: translate[1],
				// 		left: translate[0],
				// 	};
				// }}
				// Scale
				onScaleStart={moveableData.onScaleStart}
				onScale={moveableData.onScale}
				onScaleGroupStart={moveableData.onScaleGroupStart}
				onScaleGroup={moveableData.onScaleGroup}
				// Resize
				resizable={true}
				onResizeStart={moveableData.onResizeStart}
				onResize={(e) => {
					moveableData.onResize(e);
				}}
				onResizeEnd={(e) => {
					let id = e.target.getAttribute(SOLIDUI_ELEMENT_ID);
					if (null === id || undefined === id) {
						return;
					}
					if (e.lastEvent === null || e.lastEvent === undefined) {
						return;
					}
					let view = mm.getView(id);
					if (null === view || undefined === view) {
						return;
					}
					let w = e.lastEvent.boundingWidth;
					let h = e.lastEvent.boundingHeight;
					view.size = { ...view.size, width: w, height: h };
					eventbus.emit("onResize", { id: id, width: w, height: h });
				}}
				onResizeGroupStart={moveableData.onResizeGroupStart}
				onResizeGroup={moveableData.onResizeGroup}
				onResizeGroupEnd={(e) => {
					let evts = e.events || [];
					let eventData: OnReiszeGroupEventData = {};
					for (let i = 0; i < evts.length; i++) {
						if (evts[i].lastEvent === null || evts[i].lastEvent === undefined) {
							return;
						}
						let t = evts[i].target;
						let w = evts[i].lastEvent.boundingWidth;
						let h = evts[i].lastEvent.boundingHeight;
						let tid = t.getAttribute(SOLIDUI_ELEMENT_ID);
						if (null === tid || undefined === tid) {
							continue;
						}
						eventData[tid] = { width: w, height: h };
					}
					eventbus.emit("onResizeGroup", eventData);
				}}
				// Rotate
				rotatable={true}
				onRotateStart={moveableData.onRotateStart}
				onRotate={moveableData.onRotate}
				onRotateGroupStart={moveableData.onRotateGroupStart}
				onRotateGroup={moveableData.onRotateGroup}
				onClick={(e) => {
					const target = e.inputTarget as any;
					if (e.isDouble && target.isContentEditable) {
						// this.selectMenu("Text");
						const el = getContentElement(target);

						if (el) {
							el.focus();
						}
					} else {
						this.getSelecto().clickTarget(e.inputEvent, e.inputTarget);
						let id = e.target.getAttribute(SOLIDUI_ELEMENT_ID);
						if (id) {
							this.getEditorManager()._internal_select_view(id);
						}
					}
				}}
				onClickGroup={(e) => {
					this.getSelecto().clickTarget(e.inputEvent, e.inputTarget);
				}}
				onBeforeRenderStart={moveableData.onBeforeRenderStart}
				onBeforeRenderGroupStart={moveableData.onBeforeRenderGroupStart}
				onRenderStart={(e) => {
					e.datas.prevData = moveableData.getFrame(e.target).get();
				}}
				onRender={(e) => {
					e.datas.isRender = true;
					// this.eventBus.requestTrigger("render");
				}}
				onRenderEnd={(e) => {
					// this.eventBus.requestTrigger("render");
					// if (!e.datas.isRender) {
					// 	return;
					// }
					// this.historyManager.addAction("render", {
					// 	id: getId(e.target),
					// 	prev: e.datas.prevData,
					// 	next: moveableData.getFrame(e.target).get(),
					// });
				}}
				onRenderGroupStart={(e) => {
					e.datas.prevDatas = e.targets.map((target) =>
						moveableData.getFrame(target).get()
					);
				}}
				onRenderGroup={(e) => {
					// this.eventBus.requestTrigger("renderGroup", e);
					// e.datas.isRender = true;
				}}
				onRenderGroupEnd={(e) => {
					// this.eventBus.requestTrigger("renderGroup", e);
					// if (!e.datas.isRender) {
					// 	return;
					// }
					// const prevDatas = e.datas.prevDatas;
					// const infos = e.targets.map((target, i) => {
					// 	return {
					// 		id: getId(target),
					// 		prev: prevDatas[i],
					// 		next: moveableData.getFrame(target).get(),
					// 	};
					// });
					// this.historyManager.addAction("renders", {
					// 	infos,
					// });
				}}
			></Moveable>
		);
	}
	public renderViewportMoveable() {
		const moveableData = this.moveableData;
		const viewport = this.getViewport();
		const target = viewport ? viewport.viewportRef.current! : null;

		return (
			<Moveable
				ref={this.moveable}
				rotatable={true}
				target={target}
				origin={false}
				onRotateStart={moveableData.onRotateStart}
				onRotate={moveableData.onRotate}
			></Moveable>
		);
	}
	public componentDidMount() {}
	public updateRect() {
		this.getMoveable().updateRect();
	}
}
export default interface MoveableManager extends EditorInterface {}