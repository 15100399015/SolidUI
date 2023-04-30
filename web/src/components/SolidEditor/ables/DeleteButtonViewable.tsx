import { MoveableManagerInterface, Renderer } from "react-moveable";
import { SolidEditorContext } from "../SolidEditorContext";
import SolidEditor from "../SolidEditor";
import { SOLIDUI_ELEMENT_ID } from "../utils/const";
import { eventbus, mm } from "@/utils";

export interface DelteButtonViewableProps {
	deleteButtonViewable?: boolean;
}
export const DelteButtonViewable = {
	name: "deleteButtonViewable",
	props: {
		deleteButtonViewable: Boolean,
	},
	events: {},
	render(moveable: MoveableManagerInterface, React: Renderer) {
		const rect = moveable.getRect();
		const { pos2 } = moveable.state;

		const DeleteButton = moveable.useCSS(
			"div",
			`
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
            width: 24px;
            height: 24px;
            background: #4af;
            background: var(--moveable-color);
            opacity: 0.9;
            border-radius: 4px;
        }
        :host:before, :host:after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            width: 16px;
            height: 2px;
            background: #fff;
            border-radius: 1px;
            cursor: pointer;
        }
        :host:after {
            transform: translate(-50%, -50%) rotate(-45deg);
        }
        `
		);
		return (
			<SolidEditorContext.Consumer key="delete-button-viewer">
				{(editor: SolidEditor | null) => {
					return (
						<DeleteButton
							className={"moveable-delete-button"}
							onClick={() => {
								if (editor) {
									// let ids: string[] = [];
									let targets = editor.getSelectedTargets();
									editor.removeElements(targets);
									targets.forEach((target) => {
										let id = target.getAttribute(SOLIDUI_ELEMENT_ID) as string;
										console.log(id);
										mm.removeView(id);
										// ids.push();
									});
									console.log(mm.getViews());
									eventbus.emit("onRemoveViewComplete", {
										source: "viewport",
									});
								}
							}}
							style={{
								transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`,
							}}
						/>
					);
				}}
			</SolidEditorContext.Consumer>
		);
	},
} as const;