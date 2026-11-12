## Test automatico: attivo SOLO con la variabile d'ambiente LP_AUTOTEST=1.
## Scorre tutto il gioco in modalità "salta", sceglie da solo ai bivi,
## salva screenshot periodici in LP_SHOTS e chiude il gioco alla fine.
## In una partita normale questo file non fa niente.
init -10 python:
    import os as _lp_os
    _lp_test = _lp_os.environ.get("LP_AUTOTEST") == "1"
    _lp_shots = _lp_os.environ.get("LP_SHOTS", "")
    _lp_every = int(_lp_os.environ.get("LP_EVERY", "40"))
    _lp_count = [0, 0]

    def _lp_label(name, abnormal):
        if _lp_test and not name.startswith("_"):
            _lp_log("LABEL " + name)

    def _lp_callback(event, interact=True, **kwargs):
        if event != "show_done":
            return
        _lp_count[0] += 1
        if _lp_shots and (_lp_count[0] - 1) % _lp_every == 0:
            _lp_count[1] += 1
            try:
                ok = renpy.screenshot(_lp_os.path.join(_lp_shots, "shot_%04d.png" % _lp_count[1]))
            except Exception as e:
                ok = repr(e)
            _lp_log("shot %d %s %s" % (_lp_count[1], ok, renpy.get_filename_line()))

    def _lp_log(msg):
        if _lp_shots:
            with open(_lp_os.path.join(_lp_shots, "autotest.log"), "a") as f:
                f.write(msg + "\n")

    if _lp_test:
        config.all_character_callbacks.append(_lp_callback)
        config.label_callbacks.append(_lp_label)
        config.auto_choice_delay = 0.05
        preferences.skip_unseen = True
        preferences.skip_after_choices = True
        config.has_autosave = False

label _lp_go:
    $ _lp_log("START")
    $ config.skipping = "slow"
    jump start

## LP_MENUSHOT=1: fotografa il menu principale (e Salva/Opzioni) e chiude.
init -10 python:
    _lp_menushot = _lp_os.environ.get("LP_MENUSHOT") == "1"

    def _lp_snap(name):
        renpy.screenshot(_lp_os.path.join(_lp_shots, name))

screen _lp_menu_snapper():
    zorder 500
    timer 5.0 action [Function(_lp_snap, "menu_main.png"), ShowMenu("preferences")]
    timer 7.0 action [Function(_lp_snap, "menu_prefs.png"), ShowMenu("load")]
    timer 9.0 action [Function(_lp_snap, "menu_load.png"), Quit(confirm=False)]

init 10 python:
    if _lp_menushot:
        config.always_shown_screens.append("_lp_menu_snapper")
