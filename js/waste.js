$(function () {

    var localizedTitle = "Объявления, Визитки";
    var localizedSearchfieldPlaceholder = "Поиск разделов";

    switch ($("html").attr("lang")) {
        case "uk":
            localizedTitle = "Оголошення, Візитки";
            localizedSearchfieldPlaceholder = "Пошук розділів";
            break;
        case "en":
            localizedTitle = "Ads & Companies";
            localizedSearchfieldPlaceholder = "Category search";
            break;
    }

    /* Mmenu.js пытается открыть меню сразу после загрузки страницы,
     * если в URL адресе присутствует #menu
     * Но нам это не нужно - мы обычно хотим открыть конкретное подменю */
    if ($(location).attr('hash') == "#menu")
        history.replaceState({}, null, "#");

    const mobileMenu = new Mmenu("#menu",
        {
            backButton: true,
            extensions: [
                "fullscreen",
                "position-front",
                "theme-green"
            ],
            iconPanels: true,
            navbar: {
                title: localizedTitle
            },
            navbars: [
                { content: ["searchfield", "close"] }
            ],
            screenReader: { text: false }, // отключить текст для читателя экрана, иначе Google его индексирует
            searchfield: { placeholder: localizedSearchfieldPlaceholder },
            setSelected: true,
            scrollBugFix: false,
            wrappers: ["bootstrap"]
        },
        {
            language: "ru",
            offCanvas:
            {
                clone: true, // мобильное меню слишком отличается от десктопного, приходится создать отдельную копию всего в DOM
                menu: { insertMethod: "append" } // SEO: нет смысла размещать сразу две копии меню в начале DOM; передвинуть мобильное в самый конец
            }, 
            searchfield: { clear: true }, // кнопка очистки поиска
            classNames: { vertical: "lvl-3" } // CSS класс для вертикального подменю
        });

    const desktopMenu = new Mmenu("#menu",
        {
            backButton: true,
            columns: {
                add: true,
                visible: {
                    max: 2,
                    min: 2
                }
            },
            extensions: [
                "shadow-panels",
                "theme-green",
                "pagedim-black",
                "popup"
            ],
            navbar: {
                title: localizedTitle
            },
            navbars: [
                { content: ["searchfield", "close"] },
            ],
            screenReader: { text: false }, // отключить текст для читателя экрана, иначе Google его индексирует
            searchfield: { placeholder: localizedSearchfieldPlaceholder },
            setSelected: true,
            wrappers: ["bootstrap"],
        },
        {
            language: "ru",
            searchfield: { clear: true }
        });

    const mdBreakpoint = window.matchMedia("(min-width: 768px)");

    function openSubmenu(hash) {

        var isMobile = !mdBreakpoint.matches;

        var panelSelector = hash + "-panel";
        if (isMobile) {
            panelSelector = "#mm-" + panelSelector.substring(1);
        }

        var panel = document.querySelector(panelSelector);
        if (panel == null) return;

        var menu = isMobile ? mobileMenu : desktopMenu;
        menu.API.closeAllPanels();
        menu.API.openPanel(panel);
        menu.open();

        scrollIntoView(panelSelector);
    }

    function openMenu() {
        var isMobile = !mdBreakpoint.matches;
        var menu = isMobile ? mobileMenu : desktopMenu;
        menu.API.closeAllPanels();
        menu.open();
    }

    function scrollIntoView(panelSelector) {

        var listitem = $("a[href='" + panelSelector + "']")
            .parent("li.mm-listitem");

        listitem[0].scrollIntoView(false);
    }

    $("a[data-menu-opener]").click(function () {
        var hash = $(this).attr("href");
        if (hash == '#') {
            openMenu();
            return;
        }

        var isMobile = !mdBreakpoint.matches;
        if (isMobile) {
            if ($(this).data("menu-opener") == "has-subcategories") {
                hash += "-subcategories";
            }
        }
        openSubmenu(hash);
    });

    $("#menu a, #mm-menu a")
        .not("[href*='#']")
        .click(function () {
            var panelId = $(this).parents("div.mm-panel").attr("id");
            var hash = "#" + panelId.replace("-panel", "").replace("mm-", "");
            history.replaceState({}, null, hash);
        });

    // Create the query list.
    function closeMenuOnBreakpoint(evt) {
        if (evt.matches) {
            mobileMenu.close();
        } else {
            desktopMenu.close();
        }
    }
    mdBreakpoint.addListener(closeMenuOnBreakpoint);

    var hash = $(location).attr('hash');
    openSubmenu(hash);
}
);
