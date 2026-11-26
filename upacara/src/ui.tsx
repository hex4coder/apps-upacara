import { useCallback } from '@lynx-js/react';

export type Screen = 'beranda' | 'lagu' | 'urutan' | 'setelan' | 'player';

interface NavBarProps {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
}

const items: Array<{ id: Exclude<Screen, 'player'>; label: string }> = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'lagu', label: 'Lagu' },
  { id: 'urutan', label: 'Urutan' },
  { id: 'setelan', label: 'Setelan' },
];

export function NavBar({ screen, onNavigate }: NavBarProps) {
  const keBeranda = useCallback(() => {
    'background only';
    onNavigate('beranda');
  }, [onNavigate]);
  const keLagu = useCallback(() => {
    'background only';
    onNavigate('lagu');
  }, [onNavigate]);
  const keUrutan = useCallback(() => {
    'background only';
    onNavigate('urutan');
  }, [onNavigate]);
  const keSetelan = useCallback(() => {
    'background only';
    onNavigate('setelan');
  }, [onNavigate]);

  const handlers = {
    beranda: keBeranda,
    lagu: keLagu,
    urutan: keUrutan,
    setelan: keSetelan,
  };

  return (
    <view className="nav">
      {items.map((item) => {
        const aktif = screen === item.id || (screen === 'player' && item.id === 'lagu');
        return (
          <view
            className={aktif ? 'nav-item nav-item--aktif' : 'nav-item'}
            bindtap={handlers[item.id]}
            key={item.id}
          >
            <text className={aktif ? 'nav-label nav-label--aktif' : 'nav-label'}>
              {item.label}
            </text>
          </view>
        );
      })}
    </view>
  );
}
