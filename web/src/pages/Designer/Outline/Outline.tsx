import React from "react";
import { Tooltip } from "antd";
import useOutline from "./useOutline";
import { mm } from "@/utils";
import { isNil } from "lodash-es";
import { SolidViewDataType } from "@/types";
import "./outline.less";

function Outline() {
	const { selectView, getViewState } = useOutline();

	function renderViews() {
		let currentPage = mm.getCurrentPage();
		let views: SolidViewDataType[] = [];
		if (!isNil(currentPage)) {
			views = currentPage.views;
		}
		let nodes: React.ReactNode[] = [];
		views.forEach((view) => {
			let vs = getViewState(view.id);
			let selected = false;
			if (!isNil(vs)) {
				selected = vs.selected;
			}
			nodes.push(
				<li
					className={`chartview ${selected ? "selected" : ""}`}
					key={`key_${view.id}`}
					onClick={() => {
						selectView(view.id);
					}}
				>
					<span className="eblock"></span>
					<i
						className="bi-font bi-chart-column"
						style={{
							position: "relative",
							fontSize: "16px",
							color: "#3dd8ff",
						}}
					/>
					<span className="text">{view.title}</span>
					<div className="act act-eye">
						<Tooltip title="hide">
							<i className="bi-font bi-eye" />
						</Tooltip>
					</div>
					<div className="act act-lock">
						<Tooltip title="lock">
							<i className="bi-font bi-lock" />
						</Tooltip>
					</div>
				</li>
			);
		});
		return nodes;
	}

	return (
		<div className="aside-outline">
			<div className="heading">
				<span
					style={{
						position: "relative",
						height: "38px",
						width: "100%",
						fontSize: "14px",
						// color: "#fff",
						lineHeight: "38px",
					}}
				>
					View List
				</span>
			</div>
			<div className="components">
				<div
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
						overflow: "hidden",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							overflow: "scroll",
							marginRight: "-4px",
							marginBottom: "-4px",
						}}
					>
						<ul className="charts">
							<div className="charts-container">{renderViews()}</div>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Outline;