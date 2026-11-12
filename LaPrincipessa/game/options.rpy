## Opzioni del progetto ########################################################

define config.name = _("La Principessa")
define gui.show_name = False
define config.version = "1.0"

define gui.about = _p("""
Una visual novel lineare in dieci capitoli.
Valdorsa, centro commerciale Il Girasole. Una saracinesca che non si chiude, una radio sovietica, una nonna molto severa.

Stile grafico ispirato a Z.A.T.O. // I Love the World and Everything In It.
Musiche: Kevin MacLeod (incompetech.com). \"Podmoskovnye vechera\": Vladimir Troshin (1956), archive.org.
Effetti sonori: Freesound.org. Font: Courier Prime (Google Fonts).
""")

define build.name = "LaPrincipessa"
define config.save_directory = "LaPrincipessa-1731"
define config.window_icon = "gui/window_icon.png"

define config.has_sound = True
define config.has_music = True
define config.has_voice = False

define config.enter_transition = dissolve
define config.exit_transition = dissolve
define config.intra_transition = dissolve
define config.after_load_transition = None
define config.end_game_transition = fade

define config.window = "auto"
define config.window_show_transition = Dissolve(.2)
define config.window_hide_transition = Dissolve(.2)

default preferences.text_cps = 45
default preferences.afm_time = 15

define config.default_music_volume = 0.7
define config.default_sfx_volume = 0.8

## lingua
define config.language = None
define config.default_language = None

init python:
    build.classify('**~', None)
    build.classify('**.bak', None)
    build.classify('**/.**', None)
    build.classify('**/#**', None)
    build.classify('**/thumbs.db', None)
    build.documentation('*.html')
    build.documentation('*.txt')
