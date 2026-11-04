// The top bar: brand and clock, the Mac pill, replay, settings, night switch.
// Static markup: the office's code (src/office) finds these elements by id and fills them in.
import SettingsPanel from './SettingsPanel';
import { getT } from '@/i18n/server';

export default async function TopBar() {
  const t = await getT();
  return (
    <header className="topbar">
      <div className="tb-brand"><span className="logo" data-icon="logo"></span><span>My Office</span><span className="tb-clock" id="clock">--:--</span><span className="demo-chip" id="demo-chip" hidden>DEMO<span className="demo-more"> · {t('ui.topBar.sampleData')}</span></span><span className="demo-chip replay-chip" id="replay-chip" hidden></span></div>
      <div className="tb-view" role="group" aria-label={t('ui.topBar.view')}>
        <button type="button" data-view="3d" aria-pressed="true" title={t('ui.topBar.view3d')}>3D</button>
        <button type="button" data-view="2d" aria-pressed="false" title={t('ui.topBar.view2d')}>2D</button>
      </div>
      <div className="tb-actions">
        <button id="btn-mac" className="tb-btn mac-pill" type="button" data-level="normal" title={t('ui.topBar.macTitle')}><i className="lvl"></i><span className="mp-label">{t('ui.topBar.mac')}</span><span className="mp-val" id="mac-mini">{t('ui.topBar.measuring')}</span><span className="mp-bar"><b id="ml-ram"></b></span><i className="mp-tip" id="mac-tip" hidden></i></button>
        <button id="btn-chat" className="tb-btn tb-chat" type="button" aria-pressed="false" title={t('chat.openTitle')}><span data-icon="chat"></span><span className="lbl">{t('chat.open')}</span><i className="tb-badge" id="chat-badge" hidden></i></button>
        <button id="btn-replay" className="tb-btn" type="button" aria-pressed="false" title={t('ui.topBar.replayTitle')}><span data-icon="rewind"></span><span className="lbl">{t('ui.topBar.replay')}</span></button>
        <div className="pop-wrap">
          <button id="btn-look" className="tb-btn" type="button" aria-expanded="false" aria-controls="pop-look" title={t('ui.topBar.settingsTitle')}><span data-icon="gear"></span><span className="lbl">{t('ui.topBar.settings')}</span></button>
          <SettingsPanel />
        </div>
        <button id="btn-phone-top" className="tb-btn tb-icon" type="button" hidden aria-label={t('ui.topBar.phone')} title={t('ui.topBar.phoneTitle')}><span data-icon="phone"></span></button>
        <button id="btn-night" className="tb-btn tb-icon" type="button" aria-pressed="false" aria-label={t('ui.topBar.nightLabel')} title={t('ui.topBar.nightTitle')}><span data-icon="moon"></span></button>
      </div>
    </header>
  );
}
