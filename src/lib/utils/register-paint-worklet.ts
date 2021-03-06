import { createEluiName } from './create-elui-name';
import { createException } from './create-exception';
import { isClient } from './is';

type TPaintWorklet = {
  addModule: (urlJS: string) => Promise<void>;
};

type TGlobalCSS = typeof CSS;

interface IGlobalCSS extends TGlobalCSS {
  paintWorklet: TPaintWorklet;
}

const getEluiWorkletScope = () => {
  const name = `__${createEluiName('worlkets')}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((window as any)[name] ??= {});
};

export const registerPaintWorklet = async (urlOrJs: string, type: 'js' | 'link') => {
  if (isClient() && CSS && fetch && 'paintWorklet' in CSS) {
    const scope = getEluiWorkletScope();

    if (['loading', 'loaded'].includes(scope[urlOrJs])) return;

    try {
      scope[urlOrJs] = 'loading';
      const module = type === 'link' ? await (await fetch(urlOrJs)).text() : urlOrJs;
      scope[urlOrJs] = 'loaded';
      const blob = new Blob([module], { type: 'text/javascript' });
      const workletUrl = URL.createObjectURL(blob);
      await (CSS as IGlobalCSS).paintWorklet.addModule(workletUrl);
    } catch {
      scope[urlOrJs] = 'error';
      createException(`paint worklet not were loaded ${urlOrJs}`, { withName: true, variant: 'console' });
    }
  }
};
