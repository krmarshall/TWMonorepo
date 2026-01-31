import { cloneElement, JSX, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Placement,
  offset,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  FloatingPortal,
  autoPlacement,
  limitShift,
  useId,
} from '@floating-ui/react';
import useBulkMediaQueries from '../hooks/useBulkMediaQueries.tsx';

interface Props {
  tooltip: JSX.Element;
  placement?: Placement;
  children: JSX.Element;
  skillClickHandler?: (event: MouseEvent) => void;
  noSkillRanks?: boolean;
}

// Adapted from documentation example:
// https://codesandbox.io/s/winter-tree-wmmffl?file=/src/Tooltip.tsx
const TooltipWrapper = ({ children, tooltip, placement = 'right', skillClickHandler, noSkillRanks = false }: Props) => {
  const [open, setOpen] = useState(false);
  const { isMobile, isPortrait } = useBulkMediaQueries();
  const tooltipId = useId();

  const { x, y, strategy, context, refs, update } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(20),
      autoPlacement({ padding: 8 }),
      shift({ padding: 8, crossAxis: true, limiter: limitShift() }),
    ],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([useHover(context)]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [refs.reference, refs.floating, update, open]);

  return (
    <>
      {!isMobile && (
        <>
          {cloneElement(children, getReferenceProps({ ref: refs.setReference, ...children.props }))}
          <FloatingPortal>
            {open && (
              <div
                {...getFloatingProps({
                  ref: refs.setFloating,
                  className: 'Tooltip z-30 max-h-[98vh] fade-in font-[CaslonAntique] select-none',
                  style: {
                    position: strategy,
                    // top: y ?? '', // Allegedly using below transform is better perf but can blur if set on subpixels?
                    // left: x ?? '',
                    top: '0',
                    left: '0',
                    transform: `translate(${Math.round(x as number)}px,${Math.round(y as number)}px)`,
                  },
                })}
              >
                {tooltip}
              </div>
            )}
          </FloatingPortal>
        </>
      )}

      {isMobile && (
        <>
          <button
            className="block"
            popoverTarget={'tooltipPopover' + tooltipId}
            popoverTargetAction="show"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {cloneElement(children, getReferenceProps({ ref: refs.setReference, ...children.props }))}
          </button>
          <div
            className="m-auto bg-transparent"
            popover="auto"
            id={'tooltipPopover' + tooltipId}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {isPortrait && (
              <div className="flex flex-col w-screen h-dvh p-2">
                {/* <div className="w-full grow max-h-[15vh] mb-2 border bg-gray-900 border-gray-400">
                  <div className="h-[15vh]">Ad Test</div>
                </div> */}
                {tooltip}
                <div className="flex flex-row flex-nowrap place-content-around text-xl m-1.5">
                  {!noSkillRanks && (
                    <>
                      <button
                        className="button bg-green-700 hover-scale"
                        onClick={() => {
                          if (skillClickHandler !== undefined) {
                            skillClickHandler(new MouseEvent('mousedown', { button: 0 }) as unknown as MouseEvent);
                          }
                        }}
                      >
                        Skill Up
                      </button>
                      <button
                        className="button bg-red-800 hover-scale"
                        onClick={() => {
                          if (skillClickHandler !== undefined) {
                            skillClickHandler(new MouseEvent('mousedown', { button: 2 }) as unknown as MouseEvent);
                          }
                        }}
                      >
                        Skill Down
                      </button>
                    </>
                  )}

                  <button
                    className="button bg-gray-400 hover-scale"
                    popoverTarget={'tooltipPopover' + tooltipId}
                    popoverTargetAction="hide"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            {!isPortrait && (
              <div className="flex flex-row w-screen h-dvh px-2">
                <div className="invisible max-w-[20vw] min-w-[20vw] grow h-dvh mr-2 border bg-gray-900 border-gray-400">
                  <div className="w-[20vh]">Ad Test</div>
                </div>
                <div className="flex flex-col w-fit h-dvh mx-auto">
                  {tooltip}
                  <div className="flex flex-row flex-nowrap gap-2 place-content-around text-xl m-1.5">
                    {!noSkillRanks && (
                      <>
                        <button
                          className="button bg-green-700 hover-scale"
                          onClick={() => {
                            if (skillClickHandler !== undefined) {
                              skillClickHandler(new MouseEvent('mousedown', { button: 0 }) as unknown as MouseEvent);
                            }
                          }}
                        >
                          Skill Up
                        </button>
                        <button
                          className="button bg-red-800 hover-scale"
                          onClick={() => {
                            if (skillClickHandler !== undefined) {
                              skillClickHandler(new MouseEvent('mousedown', { button: 2 }) as unknown as MouseEvent);
                            }
                          }}
                        >
                          Skill Down
                        </button>
                      </>
                    )}

                    <button
                      className="button bg-gray-400 hover-scale"
                      popoverTarget={'tooltipPopover' + tooltipId}
                      popoverTargetAction="hide"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="invisible max-w-[20vw] min-w-[20vw] grow h-dvh ml-2 border bg-gray-900 border-gray-400">
                  <div className="w-[20vh]">Ad Test</div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TooltipWrapper;
