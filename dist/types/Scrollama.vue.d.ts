declare const _default: import("vue").DefineComponent<{}, {}, {
    scroller: any;
}, {
    opts(): {
        step: any[];
        progress: any;
    } & {
        [x: string]: unknown;
    };
}, {
    setup(): void;
    handleResize(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("step-progress" | "step-enter" | "step-exit")[], "step-progress" | "step-enter" | "step-exit", import("vue").PublicProps, Readonly<{}> & Readonly<{
    "onStep-progress"?: (...args: any[]) => any;
    "onStep-enter"?: (...args: any[]) => any;
    "onStep-exit"?: (...args: any[]) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
