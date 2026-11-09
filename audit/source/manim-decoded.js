function _0xd304(_0x197bb3, _0x4653d3) {
  _0x197bb3 = _0x197bb3 - 0x108;
  const _0x57aaaf = _0x57aa();
  let _0xd30450 = _0x57aaaf[_0x197bb3];
  return _0xd30450;
}
const _0x188dea = _0xd304;
(function (_0x4769c8, _0x1e34b8) {
  const _0x2bee7b = _0xd304,
    _0x18179e = _0x4769c8();
  while (!![]) {
    try {
      const _0x399dc0 =
        -parseInt("26329CJrjrX") / 0x1 +
        -parseInt("341530gElrZi") / 0x2 +
        parseInt("1472325eEWeaI") / 0x3 +
        (-parseInt("12uNcnqr") / 0x4) * (parseInt("66590kGTtpz") / 0x5) +
        parseInt("2378670KMzsyd") / 0x6 +
        (parseInt("6181CYBGZD") / 0x7) * (parseInt("2984dQtzOL") / 0x8) +
        -parseInt("6346530WhrNMg") / 0x9;
      if (_0x399dc0 === _0x1e34b8) break;
      else _0x18179e["push"](_0x18179e["shift"]());
    } catch (_0x4a14f3) {
      _0x18179e["push"](_0x18179e["shift"]());
    }
  }
})(_0x57aa, 0x42fb9);
function easedScrub(
  _0x29c4d5,
  _0x3ece93,
  _0x532055 = 0.18,
  _0x426f3c = "power2.out",
) {
  const _0x2a0517 = _0x188dea,
    _0xb4f823 = { p: 0x0 },
    _0x1e3af1 = gsap["quickTo"](_0xb4f823, "p", {
      duration: _0x532055,
      ease: _0x426f3c,
      onUpdate: () => _0x29c4d5["progress"](_0xb4f823["p"]),
    });
  return (
    _0x3ece93["refresh"] && _0x3ece93["refresh"](),
    _0x3ece93["animation"] && _0x3ece93["animation"]["progress"](0x0),
    (_0x3ece93["animation"] = _0x29c4d5["pause"]()),
    _0x3ece93["update"] && _0x3ece93["update"](),
    (_0x3ece93["vars"]["onUpdate"] = () => _0x1e3af1(_0x3ece93["progress"])),
    (_0x3ece93["vars"]["onRefresh"] = () => {
      const _0x44230b = _0x2a0517;
      ((_0xb4f823["p"] = _0x3ece93["progress"]),
        _0x29c4d5["progress"](_0xb4f823["p"]));
    }),
    _0x3ece93["refresh"](),
    _0x3ece93
  );
}
if (!window["__PARALLAX_APP_INITIALIZED__"]) {
  ((window["__PARALLAX_APP_INITIALIZED__"] = !![]),
    gsap["registerPlugin"](ScrollTrigger));
  if ("scrollRestoration" in history) history["scrollRestoration"] = "auto";
  (ScrollTrigger["normalizeScroll"](!![]),
    ScrollTrigger["config"]({ ignoreMobileResize: !![] }));
  const lenis = new Lenis({
    smoothWheel: !![],
    smoothTouch: !![],
    duration: 0.9,
    easing: (_0x52373e) => 0x1 - Math["pow"](0x1 - _0x52373e, 0x3),
    wheelMultiplier: 0x1,
  });
  ((window["lenis"] = lenis), lenis["on"]("scroll", ScrollTrigger["update"]));
  function raf(_0x2703b4) {
    (lenis["raf"](_0x2703b4), requestAnimationFrame(raf));
  }
  requestAnimationFrame(raf);
  let FS_OPEN = ![];
  ScrollTrigger["saveStyles"](".panel, .panel__scaler");
  const ready = (_0x8254f7) =>
      document["readyState"] === "complete" ||
      document["readyState"] === "interactive"
        ? _0x8254f7()
        : document["addEventListener"]("DOMContentLoaded", _0x8254f7, {
            once: !![],
          }),
    ParallaxFX = (() => {
      const _0x15a217 = _0x188dea;
      let _0x5c8c50 = [],
        _0x191de = [];
      function _0x2f5a46(_0x59c918) {
        const _0x58bed9 = _0xd304,
          _0x3cf8b8 = _0x59c918["querySelector"](":scope > .panel__scaler");
        if (_0x3cf8b8) return _0x3cf8b8;
        const _0x4303c8 = document["createElement"]("div");
        ((_0x4303c8["className"] = "panel__scaler"),
          (_0x4303c8["style"]["willChange"] = "transform"));
        while (_0x59c918["firstChild"])
          _0x4303c8["appendChild"](_0x59c918["firstChild"]);
        return (_0x59c918["appendChild"](_0x4303c8), _0x4303c8);
      }
      function _0x3ceed4() {
        const _0x55fe47 = _0xd304;
        (_0x5c8c50["forEach"](
          (_0x315a9b) => _0x315a9b && _0x315a9b["kill"](!![]),
        ),
          _0x191de["forEach"]((_0x182a76) => {
            const _0x22253a = _0x55fe47;
            if (_0x182a76 && _0x182a76["scrollTrigger"])
              _0x182a76["scrollTrigger"]["kill"](!![]);
            _0x182a76 && _0x182a76["kill"]();
          }),
          (_0x5c8c50 = []),
          (_0x191de = []),
          document["querySelectorAll"](".pin-spacer")["forEach"](
            (_0x1d7ce5) => {
              const _0x13832c = _0x55fe47,
                _0x56e84d = _0x1d7ce5["firstElementChild"];
              _0x56e84d &&
                _0x56e84d["classList"]["contains"]("panel") &&
                (_0x1d7ce5["parentNode"]["insertBefore"](_0x56e84d, _0x1d7ce5),
                _0x1d7ce5["remove"]());
            },
          ));
      }
      function _0x4b2b95() {
        const _0xc9b73c = _0xd304;
        if (FS_OPEN) return;
        _0x3ceed4();
        const _0x1d0fe3 = document["querySelector"](".stack");
        if (!_0x1d0fe3) {
          ScrollTrigger["refresh"]();
          return;
        }
        const _0x37c897 = gsap["utils"]["toArray"](".panel", _0x1d0fe3),
          _0x3605b7 = _0x37c897["filter"](
            (_0x53733f) => !_0x53733f["hasAttribute"]("data-parallax-ignore"),
          ),
          _0x4b2ec0 = _0x3605b7["map"](_0x2f5a46),
          _0x226219 = (_0x2593c0) =>
            _0x2593c0["scrollHeight"] > window["innerHeight"] * 1.02;
        _0x3605b7["forEach"]((_0x507321, _0x37cd37) => {
          const _0x315673 = _0xc9b73c,
            _0x5ccc15 = _0x3605b7[_0x37cd37 + 0x1];
          if (!_0x5ccc15) return;
          const _0x8b2bb7 = _0x226219(_0x507321);
          _0x5c8c50["push"](
            ScrollTrigger["create"]({
              trigger: _0x507321,
              start: _0x8b2bb7 ? "bottom bottom" : "top top",
              endTrigger: _0x5ccc15,
              end: "top top",
              pin: !![],
              pinSpacing: ![],
              anticipatePin: 0x1,
              invalidateOnRefresh: !![],
            }),
          );
        });
        for (
          let _0x39c878 = 0x1;
          _0x39c878 < _0x3605b7["length"];
          _0x39c878++
        ) {
          const _0x5c111d = _0x4b2ec0[_0x39c878 - 0x1],
            _0x2eb24d = _0x3605b7[_0x39c878],
            _0x97ef61 = gsap["fromTo"](
              _0x5c111d,
              { scale: 0x1 },
              {
                scale: 0.92,
                ease: "none",
                scrollTrigger: {
                  trigger: _0x2eb24d,
                  start: "top bottom",
                  end: "top top",
                  scrub: !![],
                  invalidateOnRefresh: !![],
                },
              },
            );
          _0x191de["push"](_0x97ef61);
        }
        if (_0x4b2ec0["length"]) {
          const _0xbfa78f = _0x4b2ec0[_0x4b2ec0["length"] - 0x1],
            _0x3240fc = _0x3605b7[_0x3605b7["length"] - 0x1],
            _0x1982a7 = gsap["to"](_0xbfa78f, {
              scale: 0x1,
              ease: "none",
              scrollTrigger: {
                trigger: _0x3240fc,
                start: "top bottom",
                end: "bottom\x20top",
                scrub: !![],
                invalidateOnRefresh: !![],
              },
            });
          _0x191de["push"](_0x1982a7);
        }
        ScrollTrigger["refresh"]();
      }
      let _0x2d942f = 0x0;
      const _0x561610 = () => {
          (cancelAnimationFrame(_0x2d942f),
            (_0x2d942f = requestAnimationFrame(() => {
              (clearTimeout(_0x561610["_t"]),
                (_0x561610["_t"] = setTimeout(_0x4b2b95, 0x32)));
            })));
        },
        _0x4e436d = {
          disable: () =>
            ScrollTrigger["getAll"]()["forEach"]((_0x12d851) =>
              _0x12d851["disable"](),
            ),
          enable: () =>
            ScrollTrigger["getAll"]()["forEach"]((_0x2b5771) =>
              _0x2b5771["enable"](),
            ),
          rebuild: () => _0x561610(),
        };
      ready(() => {
        const _0x57b188 = _0x15a217;
        (requestAnimationFrame(_0x4b2b95),
          addEventListener("resize", _0x561610, { passive: !![] }),
          addEventListener("orientationchange", _0x561610),
          document["addEventListener"]("fullscreenchange", _0x561610));
        if (document["fonts"]?.["ready"])
          document["fonts"]["ready"]["then"](_0x561610);
      });
      const _0x51c2d7 = () => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            const _0x371c80 = _0xd304;
            (_0x4e436d["rebuild"](), ScrollTrigger["refresh"]());
          }),
        );
      };
      return (
        window["addEventListener"]("load", _0x51c2d7, { once: !![] }),
        window["addEventListener"]("pageshow", (_0x365004) => {
          const _0x13ecb0 = _0x15a217;
          if (_0x365004["persisted"]) _0x51c2d7();
        }),
        _0x4e436d
      );
    })();
  ((function () {
    const _0x38b68b = _0x188dea;
    let _0x4272fc = 0x0,
      _0x2d6a7e = "";
    ((window["__FSOpen"] = function () {
      const _0x1bcc61 = _0x38b68b;
      ((FS_OPEN = !![]),
        (_0x4272fc =
          window["scrollY"] ||
          document["documentElement"]["scrollTop"] ||
          0x0));
      try {
        lenis["stop"]();
      } catch {}
      const _0x4700d1 = document["documentElement"];
      ((_0x2d6a7e = _0x4700d1["style"]["overflow"]),
        (_0x4700d1["style"]["overflow"] = "hidden"));
      try {
        ParallaxFX["disable"]();
      } catch {}
      requestAnimationFrame(() => window["scrollTo"](0x0, _0x4272fc));
    }),
      (window["__FSClose"] = function () {
        const _0x5e6404 = _0x38b68b,
          _0x21cdf4 = document["documentElement"];
        _0x21cdf4["style"]["overflow"] = _0x2d6a7e || "";
        try {
          ParallaxFX["enable"]();
        } catch {}
        requestAnimationFrame(() => {
          const _0x1cb5a5 = _0x5e6404;
          try {
            ParallaxFX["rebuild"]();
          } catch {}
          window["scrollTo"](0x0, _0x4272fc);
          try {
            lenis["start"]();
          } catch {}
          FS_OPEN = ![];
        });
      }));
  })(),
    (function () {
      const _0x4e4d53 = _0x188dea,
        _0x188403 = document["getElementById"]("fsCue"),
        _0x5097f1 = document["getElementById"]("heroVideo");
      if (!_0x188403 || !_0x5097f1) return;
      let _0x1b17e5 = null,
        _0x4a1c2b = null,
        _0x311dca = null,
        _0x52dc21 = null,
        _0x7e6981 = null,
        _0x53df4a = null,
        _0x19e211 = null,
        _0x5e681e = null,
        _0x4d87f3 = null,
        _0x2efe8e = null;
      const _0x226b16 = (_0x34be35) =>
        !isFinite(_0x34be35) || _0x34be35 < 0x0
          ? "--:--"
          : Math["floor"](_0x34be35 / 0xe10)
            ? String(Math["floor"](_0x34be35 / 0xe10))["padStart"](0x2, "0") +
              ":" +
              String(Math["floor"]((_0x34be35 % 0xe10) / 0x3c))["padStart"](
                0x2,
                "0",
              ) +
              ":" +
              String(Math["floor"](_0x34be35 % 0x3c))["padStart"](0x2, "0")
            : String(Math["floor"](_0x34be35 / 0x3c))["padStart"](0x2, "0") +
              ":" +
              String(Math["floor"](_0x34be35 % 0x3c))["padStart"](0x2, "0");
      function _0x4be06d(_0x3eb2c5) {
        _0x2902c8();
        const _0x4b480f = () => {
          const _0x5d6d92 = _0xd304,
            _0x3776a3 = _0x5097f1["duration"],
            _0x503605 = _0x5097f1["currentTime"];
          if (_0x3eb2c5) {
            ((_0x3eb2c5["timeAll"]["textContent"] = isFinite(_0x3776a3)
              ? _0x226b16(_0x3776a3)
              : "--:--"),
              (_0x3eb2c5["timeNow"]["textContent"] = _0x226b16(_0x503605)));
            if (isFinite(_0x3776a3))
              _0x3eb2c5["progress"]["value"] = Math["round"](
                (_0x503605 / _0x3776a3) * 0x3e8,
              );
          }
          _0x4d87f3 = requestAnimationFrame(_0x4b480f);
        };
        _0x4d87f3 = requestAnimationFrame(_0x4b480f);
      }
      function _0x2902c8() {
        _0x4d87f3 && (cancelAnimationFrame(_0x4d87f3), (_0x4d87f3 = null));
      }
      function _0x25705e(_0x439cf1) {
        const _0x3a72a3 = _0x4e4d53,
          _0x4f5bea = document["createElement"]("div");
        _0x4f5bea["className"] = "fs-controls";
        const _0x77092a = document["createElement"]("div");
        ((_0x77092a["className"] = "fs-controls__inner"),
          _0x4f5bea["appendChild"](_0x77092a),
          _0x439cf1["appendChild"](_0x4f5bea),
          _0x4f5bea["addEventListener"]("click", (_0x35419b) =>
            _0x35419b["stopPropagation"](),
          ));
        const _0x35bd94 = (_0x26af3e, _0xb5e89d) => {
            const _0x3d9a6f = _0x3a72a3,
              _0x5e51c2 = document["createElement"]("button");
            ((_0x5e51c2["className"] = "fs-btn"),
              (_0x5e51c2["type"] = "button"),
              _0x5e51c2["setAttribute"]("aria-label", _0xb5e89d));
            const _0x534430 = document["createElement"]("i");
            return (
              (_0x534430["className"] = "bi\x20" + _0x26af3e),
              _0x5e51c2["appendChild"](_0x534430),
              _0x5e51c2
            );
          },
          _0x708bfc = (_0x230695) => {
            const _0xf6cfe5 = _0x3a72a3,
              _0x17a8a3 = document["createElement"]("span");
            return (
              (_0x17a8a3["className"] = "fs-time"),
              (_0x17a8a3["textContent"] = _0x230695),
              _0x17a8a3
            );
          },
          _0x476ec7 = _0x35bd94("bi-play-fill", "Play/Pause"),
          _0x41d633 = _0x35bd94("bi-volume-up", "Mute/Unmute"),
          _0x55014c = _0x35bd94("bi-fullscreen-exit", "Exit"),
          _0x5c5aad = _0x35bd94("bi-palette", "Colorize");
        _0x5c5aad["classList"]["add"]("colorize", "js-colorize-btn");
        const _0xef35e3 = _0x35bd94("bi-badge-hd", "Toggle HD");
        _0xef35e3["classList"]["add"]("js-quality-btn");
        const _0x4b8034 = _0x708bfc("00:00"),
          _0x3ff98a = _0x708bfc("--:--"),
          _0x36482b = document["createElement"]("input");
        ((_0x36482b["type"] = "range"),
          (_0x36482b["min"] = 0x0),
          (_0x36482b["max"] = 0x3e8),
          (_0x36482b["value"] = 0x0),
          (_0x36482b["className"] = "fs-progress"),
          _0x77092a["append"](
            _0x476ec7,
            _0x41d633,
            _0x4b8034,
            _0x36482b,
            _0x3ff98a,
            _0x5c5aad,
            _0xef35e3,
            _0x55014c,
          ));
        const _0x24ab79 = document["getElementById"]("colorFlood"),
          _0x4dc4e1 = _0x24ab79?.["dataset"]["active"] === "1",
          _0x140f02 = !_0x4dc4e1;
        _0x5c5aad["setAttribute"]("data-color", _0x140f02 ? "on" : "off");
        const _0x14809c = _0x5c5aad["querySelector"]("i");
        if (_0x14809c)
          _0x14809c["className"] =
            "bi " + (_0x140f02 ? "bi-palette-fill" : "bi-palette");
        ((_0x5c5aad["title"] = _0x140f02 ? "Enable Color" : "Remove Color"),
          _0x5c5aad["setAttribute"]("aria-pressed", String(_0x140f02)));
        const _0x59af77 = (_0x4b2c8f, _0x2cce2d) => {
            const _0xabb432 = _0x3a72a3,
              _0x1374ab = _0x4b2c8f["querySelector"]("i");
            if (_0x1374ab) _0x1374ab["className"] = "bi " + _0x2cce2d;
          },
          _0x4c3cb9 = () => {
            const _0x143b77 = _0x3a72a3;
            (_0x5097f1["paused"]
              ? (_0x5097f1["play"](), _0x59af77(_0x476ec7, "bi-pause-fill"))
              : (_0x5097f1["pause"](), _0x59af77(_0x476ec7, "bi-play-fill")),
              _0x79ad7b());
          },
          _0x5c74bb = () => {
            const _0x17f63f = _0x3a72a3;
            ((_0x5097f1["muted"] = !_0x5097f1["muted"]),
              _0x59af77(
                _0x41d633,
                _0x5097f1["muted"] ? "bi-volume-mute" : "bi-volume-up",
              ),
              _0x79ad7b());
          },
          _0x1f0a91 = () => {
            const _0x3e9a97 = _0x3a72a3;
            _0x5e681e && _0x5e681e["reversed"](!![]);
          };
        (_0x59af77(
          _0x476ec7,
          _0x5097f1["paused"] ? "bi-play-fill" : "bi-pause-fill",
        ),
          _0x59af77(
            _0x41d633,
            _0x5097f1["muted"] ? "bi-volume-mute" : "bi-volume-up",
          ));
        const _0x4dec88 = _0x5097f1["dataset"]["quality"] === "hd";
        (_0x59af77(_0xef35e3, _0x4dec88 ? "bi-badge-hd-fill" : "bi-badge-hd"),
          _0xef35e3["addEventListener"]("click", () => {
            const _0x4ea5ad = _0x3a72a3;
            try {
              window["toggleVideoQuality"]();
            } catch {}
            _0x79ad7b();
          }),
          _0x476ec7["addEventListener"]("click", _0x4c3cb9),
          _0x41d633["addEventListener"]("click", _0x5c74bb),
          _0x55014c["addEventListener"]("click", _0x1f0a91),
          _0x5c5aad["addEventListener"]("click", () => {
            const _0x58d131 = _0x3a72a3;
            try {
              window["toggleHeroColorize"]?.(_0x5c5aad);
            } catch {}
            _0x79ad7b();
          }));
        const _0x58bfb5 = (_0x5ad7e3) => {
          const _0xebeddc = _0x3a72a3,
            _0x13944e = (_0x5ad7e3["key"] || "")["toLowerCase"]();
          (_0x13944e === "\x20" || _0x13944e === "k") &&
            (_0x5ad7e3["preventDefault"](), _0x4c3cb9());
          if (_0x13944e === "m") _0x5c74bb();
          if (_0x13944e === "escape") _0x1f0a91();
        };
        document["addEventListener"]("keydown", _0x58bfb5);
        const _0x183c9e = () => {
          const _0x4f4bca = _0x3a72a3;
          if (!isFinite(_0x5097f1["duration"])) return;
          ((_0x36482b["value"] = Math["round"](
            (_0x5097f1["currentTime"] / _0x5097f1["duration"]) * 0x3e8,
          )),
            (_0x4b8034["textContent"] = _0x226b16(_0x5097f1["currentTime"])));
        };
        (_0x5097f1["addEventListener"]("loadedmetadata", () => {
          const _0x4668db = _0x3a72a3;
          if (isFinite(_0x5097f1["duration"]))
            _0x3ff98a["textContent"] = _0x226b16(_0x5097f1["duration"]);
          _0x183c9e();
        }),
          _0x5097f1["addEventListener"]("timeupdate", _0x183c9e),
          _0x36482b["addEventListener"]("input", () => {
            const _0x142278 = _0x3a72a3;
            if (!isFinite(_0x5097f1["duration"])) return;
            ((_0x5097f1["currentTime"] =
              (_0x36482b["value"] / 0x3e8) * _0x5097f1["duration"]),
              _0x79ad7b());
          }));
        let _0x5607e9;
        function _0xcee649() {
          const _0x436c01 = _0x3a72a3;
          (_0x4f5bea["classList"]["add"]("show"), _0x3f7e24());
        }
        function _0x4fa098() {
          const _0x1ccdfc = _0x3a72a3;
          _0x4f5bea["classList"]["remove"]("show");
        }
        function _0x3f7e24() {
          (clearTimeout(_0x5607e9), (_0x5607e9 = setTimeout(_0x4fa098, 0x7d0)));
        }
        function _0x79ad7b() {
          const _0x5a8c54 = _0x3a72a3;
          ((_0x4f5bea["style"]["opacity"] = "1"),
            (_0x4f5bea["style"]["transform"] = "translateY(0)"),
            _0xcee649());
        }
        return {
          el: _0x4f5bea,
          show: _0xcee649,
          hide: _0x4fa098,
          forceShow: _0x79ad7b,
          timeNow: _0x4b8034,
          timeAll: _0x3ff98a,
          progress: _0x36482b,
          destroy: () => {
            const _0x4c13d9 = _0x3a72a3;
            (clearTimeout(_0x5607e9),
              document["removeEventListener"]("keydown", _0x58bfb5),
              _0x4f5bea["remove"]());
          },
        };
      }
      function _0x3f090c(_0x181f67) {
        const _0x188372 = _0x4e4d53,
          _0x39ae63 = (_0x181f67["key"] || _0x181f67["code"] || "")[
            "toLowerCase"
          ]();
        if (!(_0x39ae63 === "escape" || _0x39ae63 === "esc")) return;
        if (!_0x5e681e) return;
        _0x5e681e["reversed"](!_0x5e681e["reversed"]());
      }
      function _0x19238f() {
        const _0x188083 = _0x4e4d53,
          _0x420ad4 = _0x5097f1["getBoundingClientRect"]();
        ((_0x1b17e5 = document["createElement"]("div")),
          (_0x1b17e5["className"] = "fs-stage"),
          Object["assign"](_0x1b17e5["style"], {
            backgroundColor: "transparent",
            backdropFilter: "none",
          }),
          document["body"]["appendChild"](_0x1b17e5),
          (_0x4a1c2b = document["createElement"]("div")),
          Object["assign"](_0x4a1c2b["style"], {
            position: "absolute",
            inset: "0",
            transformOrigin: "50% 50%",
            transform: "scale(0.98)",
            willChange: "transform",
          }),
          _0x1b17e5["appendChild"](_0x4a1c2b),
          __FSOpen(),
          (_0x52dc21 = document["createElement"]("div")),
          (_0x52dc21["className"] = "fs-veil"),
          _0x4a1c2b["appendChild"](_0x52dc21),
          (_0x311dca = document["createElement"]("div")),
          (_0x311dca["className"] = "fs-frame"),
          _0x4a1c2b["appendChild"](_0x311dca),
          (_0x7e6981 = document["createComment"]("video-placeholder")),
          _0x5097f1["parentNode"]["insertBefore"](
            _0x7e6981,
            _0x5097f1["nextSibling"],
          ),
          _0x4a1c2b["appendChild"](_0x5097f1));
        const _0x328953 = document["getElementById"]("colorFlood");
        if (_0x328953) {
          ((_0x2efe8e = _0x328953["cloneNode"](!![])),
            (_0x2efe8e["id"] = ""),
            _0x2efe8e["classList"]["add"]("fs-color-flood"),
            _0x4a1c2b["appendChild"](_0x2efe8e),
            Object["assign"](_0x2efe8e["style"], {
              position: "absolute",
              inset: "0",
              pointerEvents: "none",
              zIndex: "5",
            }));
          const _0x2bb175 = _0x328953["dataset"]["active"] === "1";
          ((_0x2efe8e["style"]["opacity"] = _0x2bb175
            ? "1"
            : _0x328953["style"]["opacity"] || "0"),
            (_0x2efe8e["style"]["pointerEvents"] = "none"),
            (_0x2efe8e["style"]["position"] = "absolute"),
            (_0x2efe8e["style"]["inset"] = "0"));
        }
        const _0x56c153 = () => _0x1b17e5["clientWidth"],
          _0x5d3354 = () => _0x1b17e5["clientHeight"],
          _0x387b10 =
            document["getElementById"]("colorFlood")?.["dataset"]["active"] ===
            "1",
          _0x4952f7 = _0x387b10 ? "grayscale(0%)" : "grayscale(100%)";
        (gsap["set"](_0x5097f1, {
          position: "absolute",
          left: 0x0,
          top: 0x0,
          width: _0x56c153(),
          height: _0x5d3354(),
          transformOrigin: "0\x200",
          zIndex: 0x3,
          margin: 0x0,
          filter: _0x4952f7,
          willChange: "transform,opacity",
        }),
          gsap["set"](_0x311dca, {
            position: "absolute",
            left: 0x0,
            top: 0x0,
            width: _0x56c153(),
            height: _0x5d3354(),
            transformOrigin: "0 0",
            zIndex: 0x4,
            opacity: 0x0,
            willChange: "transform,opacity",
          }));
        const _0x28e444 = _0x420ad4["left"],
          _0x1b0d1e = _0x420ad4["top"],
          _0xdabf43 = _0x420ad4["width"] / _0x56c153(),
          _0x37e779 = _0x420ad4["height"] / _0x5d3354();
        (gsap["set"]([_0x5097f1, _0x311dca], {
          x: _0x28e444,
          y: _0x1b0d1e,
          scaleX: _0xdabf43,
          scaleY: _0x37e779,
        }),
          (_0x53df4a = _0x25705e(_0x1b17e5)),
          _0x53df4a["forceShow"](),
          _0x4be06d(_0x53df4a),
          document["addEventListener"]("keydown", _0x3f090c),
          (_0x19e211 = new ResizeObserver(() => {
            const _0x1d9680 = _0x188083;
            (gsap["set"](_0x5097f1, {
              width: _0x56c153(),
              height: _0x5d3354(),
            }),
              gsap["set"](_0x311dca, {
                width: _0x56c153(),
                height: _0x5d3354(),
              }));
          })),
          _0x19e211["observe"](_0x1b17e5),
          (_0x5e681e = gsap["timeline"]({
            paused: !![],
            defaults: { ease: "power3.inOut" },
            onReverseComplete: _0x1c47b3,
          })),
          _0x5e681e["add"]("travel", 0x0)
            ["set"](
              _0x5097f1,
              { mixBlendMode: "screen", opacity: 0.45 },
              "travel",
            )
            ["to"](
              _0x4a1c2b,
              { scale: 0.95, duration: 0.2, ease: "power2.out" },
              "travel",
            )
            ["to"](_0x4a1c2b, { scale: 0x1, duration: 0.72 }, "travel+=0.18")
            ["to"](
              [_0x5097f1, _0x311dca],
              { scaleX: 0x1, scaleY: 0x1, x: 0x0, y: 0x0, duration: 0.74 },
              "travel+=0.06",
            )
            ["to"](
              _0x52dc21,
              { opacity: 0.35, duration: 0.34, ease: "sine.out" },
              "travel+=0.12",
            )
            ["to"](
              _0x311dca,
              { opacity: 0.34, duration: 0.26, ease: "sine.out" },
              "travel+=0.14",
            )
            ["to"](
              _0x5097f1,
              { opacity: 0x1, duration: 0.52, ease: "sine.out" },
              "travel+=0.40",
            )
            ["set"](_0x5097f1, { mixBlendMode: "normal" }, "travel+=0.74")
            ["to"](
              _0x1b17e5,
              {
                backgroundColor: "rgba(0,0,0,0.82)",
                duration: 0.28,
                ease: "sine.out",
              },
              "travel+=0.52",
            )
            ["to"](
              _0x1b17e5,
              {
                backdropFilter: "blur(6px) saturate(115%)",
                duration: 0.45,
                ease: "sine.out",
              },
              "travel+=0.52",
            )
            ["to"](
              _0x311dca,
              { opacity: 0x0, duration: 0.2, ease: "sine.out" },
              "travel+=0.64",
            )
            ["to"](
              _0x4a1c2b,
              { scale: 1.006, duration: 0.1, ease: "sine.inOut" },
              "travel+=0.68",
            )
            ["to"](
              _0x4a1c2b,
              { scale: 0x1, duration: 0.28, ease: "power1.out" },
              "travel+=0.78",
            ),
          _0x5e681e["play"](0x0));
        function _0x214fb7(_0x25c175) {
          const _0x187fe4 = _0x188083;
          if (_0x53df4a?.["el"]?.["contains"](_0x25c175["target"])) return;
          if (!_0x5e681e) return;
          _0x5e681e["reversed"](!![]);
        }
        (_0x1b17e5["addEventListener"]("dblclick", _0x214fb7),
          _0x4a1c2b["addEventListener"]("dblclick", _0x214fb7),
          _0x5097f1["addEventListener"]("dblclick", _0x214fb7),
          (_0x1b17e5["_handleDbl"] = _0x214fb7));
      }
      function _0x1c47b3() {
        const _0x478d22 = _0x4e4d53;
        try {
          _0x19e211 && _0x19e211["disconnect"]();
        } catch {}
        document["removeEventListener"]("keydown", _0x3f090c);
        try {
          _0x1b17e5 &&
            _0x1b17e5["_handleDbl"] &&
            (_0x1b17e5["removeEventListener"](
              "dblclick",
              _0x1b17e5["_handleDbl"],
            ),
            _0x4a1c2b &&
              _0x4a1c2b["removeEventListener"](
                "dblclick",
                _0x1b17e5["_handleDbl"],
              ),
            _0x5097f1 &&
              _0x5097f1["removeEventListener"](
                "dblclick",
                _0x1b17e5["_handleDbl"],
              ));
        } catch {}
        (_0x53df4a && _0x53df4a["destroy"](),
          _0x2902c8(),
          _0x7e6981?.["parentNode"] &&
            (_0x7e6981["parentNode"]["insertBefore"](_0x5097f1, _0x7e6981),
            _0x7e6981["remove"]()),
          (_0x7e6981 = null),
          _0x2efe8e && (_0x2efe8e["remove"](), (_0x2efe8e = null)),
          (_0x5097f1["style"]["cssText"] = ""),
          _0x311dca && _0x311dca["remove"](),
          (_0x311dca = null),
          _0x52dc21 && _0x52dc21["remove"](),
          (_0x52dc21 = null),
          _0x1b17e5 && _0x1b17e5["remove"](),
          (_0x1b17e5 = null),
          (_0x4a1c2b = null),
          _0x5e681e && _0x5e681e["kill"](),
          (_0x5e681e = null),
          __FSClose());
      }
      _0x188403["addEventListener"]("click", () => {
        const _0x2a5277 = _0x4e4d53;
        if (!_0x5e681e) _0x19238f();
        else _0x5e681e["reversed"](!_0x5e681e["reversed"]());
      });
    })(),
    (window["toggleHeroColorize"] = function (_0x26c1e3) {
      const _0x4cb798 = _0x188dea,
        _0x504a33 = document["getElementById"]("colorFlood"),
        _0xb77374 = document["getElementById"]("heroVideo"),
        _0x587e81 = _0x504a33?.["dataset"]["active"] === "1",
        _0xf294ce = !_0x587e81,
        _0x5ed984 = !_0xf294ce;
      _0x504a33 &&
        ((_0x504a33["dataset"]["active"] = _0xf294ce ? "1" : "0"),
        gsap["to"](_0x504a33, {
          opacity: _0xf294ce ? 0x1 : 0x0,
          duration: 0.45,
          ease: "power2.out",
        }));
      _0xb77374 &&
        gsap["to"](_0xb77374, {
          filter: _0xf294ce ? "grayscale(0%)" : "grayscale(100%)",
          duration: 0.45,
          ease: "power2.out",
        });
      const _0x4354c8 = document["querySelector"](".fs-stage .fs-color-flood");
      (_0x4354c8 &&
        gsap["to"](_0x4354c8, {
          opacity: _0xf294ce ? 0x1 : 0x0,
          duration: 0.45,
          ease: "power2.out",
        }),
        document["querySelectorAll"](".js-colorize-btn")["forEach"](
          (_0x344387) => {
            const _0x5870b6 = _0x4cb798,
              _0x1f9c15 = _0x344387["querySelector"]("i");
            _0x344387["setAttribute"]("data-color", _0x5ed984 ? "on" : "off");
            if (_0x1f9c15)
              _0x1f9c15["className"] =
                "bi " + (_0x5ed984 ? "bi-palette-fill" : "bi-palette");
            ((_0x344387["title"] = _0x5ed984 ? "Enable Color" : "Remove Color"),
              _0x344387["setAttribute"]("aria-pressed", String(_0x5ed984)));
          },
        ));
    }),
    (window["toggleVideoQuality"] = function () {
      const _0x449cf7 = _0x188dea,
        _0x30aec6 = document["getElementById"]("heroVideo");
      if (!_0x30aec6) return;
      const _0xedef74 = _0x30aec6["dataset"]["quality"] === "hd",
        _0x1b87ec = _0xedef74 ? "sd" : "hd",
        _0x493f9d = _0x30aec6["querySelector"]("source");
      if (!_0x493f9d) return;
      const _0x4f5906 = _0x493f9d["getAttribute"]("data-src-" + _0x1b87ec);
      if (!_0x4f5906) return;
      const _0x4cbf32 = !_0x30aec6["paused"],
        _0x1f585f = _0x30aec6["currentTime"];
      ((_0x30aec6["src"] = _0x4f5906),
        (_0x30aec6["dataset"]["quality"] = _0x1b87ec),
        _0x30aec6["load"](),
        (_0x30aec6["currentTime"] = _0x1f585f));
      if (_0x4cbf32) {
        const _0x11b213 = _0x30aec6["play"]();
        _0x11b213 !== undefined && _0x11b213["catch"](() => {});
      }
      const _0x564a83 = _0x1b87ec === "hd";
      document["querySelectorAll"](".js-quality-btn")["forEach"](
        (_0x2f617a) => {
          const _0xef289b = _0x449cf7,
            _0x33eab9 = _0x2f617a["querySelector"]("i");
          if (_0x33eab9)
            _0x33eab9["className"] =
              "bi " +
              (_0x564a83 ? "bi-badge-hd-fill" : "bi-badge-hd text-white-50");
          _0x2f617a["title"] = _0x564a83
            ? "Switch to Standard Quality"
            : "Watch\x20in\x20HD";
        },
      );
    }));
}
function _0x57aa() {
  const _0x5872a2 = [
    "341530gElrZi",
    "create",
    "travel+=0.64",
    "preventDefault",
    "fromTo",
    "stopPropagation",
    "2984dQtzOL",
    "aria-pressed",
    "66590kGTtpz",
    "grayscale(100%)",
    "50%\x2050%",
    "currentTime",
    "travel+=0.74",
    "bi-volume-up",
    "registerPlugin",
    "Play/Pause",
    "querySelectorAll",
    "fs-time",
    "26329CJrjrX",
    "kill",
    "toLowerCase",
    "rebuild",
    "timeline",
    "fullscreenchange",
    "textContent",
    "colorFlood",
    "fs-color-flood",
    ":scope\x20>\x20.panel__scaler",
    "fs-veil",
    "bi-palette-fill",
    "toggleHeroColorize",
    "stop",
    "active",
    "data-color",
    "overflow",
    "top",
    "bi-palette",
    "bi-badge-hd\x20text-white-50",
    "config",
    "width",
    "disable",
    "paused",
    "pointerEvents",
    "catch",
    "transform",
    "transform,opacity",
    "appendChild",
    "removeEventListener",
    "saveStyles",
    "enable",
    "type",
    "classList",
    "fs-frame",
    "scrollY",
    "timeAll",
    "data-src-",
    "normal",
    "reversed",
    "round",
    "target",
    "travel+=0.68",
    "Exit",
    "bi-badge-hd-fill",
    "className",
    "dblclick",
    "duration",
    "timeupdate",
    "opacity",
    "insertBefore",
    "start",
    "_handleDbl",
    "quality",
    "none",
    "vars",
    "resize",
    "Colorize",
    "6346530WhrNMg",
    "muted",
    "querySelector",
    "createElement",
    "max",
    ".js-colorize-btn",
    "--:--",
    "Enable\x20Color",
    "scrollTop",
    "contains",
    "bi-play-fill",
    "min",
    "colorize",
    "setAttribute",
    "length",
    "fs-controls__inner",
    "bi\x20",
    "travel",
    "timeNow",
    "documentElement",
    "clientWidth",
    "transparent",
    "quickTo",
    "top\x20bottom",
    "readyState",
    "__PARALLAX_APP_INITIALIZED__",
    "00:00",
    "input",
    "js-colorize-btn",
    "floor",
    "fonts",
    "bi-fullscreen-exit",
    "pause",
    "normalizeScroll",
    "set",
    "scrollTo",
    "createComment",
    "video-placeholder",
    "Mute/Unmute",
    "remove",
    "pow",
    "aria-label",
    "persisted",
    "heroVideo",
    "scrollRestoration",
    "load",
    "blur(6px)\x20saturate(115%)",
    "travel+=0.78",
    "title",
    "bottom\x20bottom",
    "power3.inOut",
    "screen",
    "nextSibling",
    "progress",
    "addEventListener",
    "__FSClose",
    "translateY(0)",
    "panel__scaler",
    "animation",
    "travel+=0.12",
    "fs-progress",
    "scroll",
    "cssText",
    "assign",
    "complete",
    "fsCue",
    "src",
    "Remove\x20Color",
    "play",
    "observe",
    "getAttribute",
    "absolute",
    "getAll",
    "forEach",
    "power2.out",
    "toggleVideoQuality",
    "top\x20top",
    "button",
    "fs-stage",
    "lenis",
    "code",
    "hidden",
    "toArray",
    "onUpdate",
    "value",
    "panel",
    "2378670KMzsyd",
    "show",
    "scrollHeight",
    "0\x200",
    "parentNode",
    "source",
    "append",
    "keydown",
    ".panel,\x20.panel__scaler",
    "span",
    ".panel",
    "style",
    "1472325eEWeaI",
    "travel+=0.06",
    "cloneNode",
    "firstChild",
    "div",
    "loadedmetadata",
    ".fs-stage\x20.fs-color-flood",
    "fs-btn",
    "map",
    "interactive",
    "ready",
    "then",
    "destroy",
    "inset",
    "push",
    ".stack",
    "Toggle\x20HD",
    "__FSOpen",
    "fs-controls",
    "bi-pause-fill",
    "bi-badge-hd",
    "add",
    "padStart",
    "Switch\x20to\x20Standard\x20Quality",
    "clientHeight",
    "filter",
    "refresh",
    "bi-volume-mute",
    "getElementById",
    "click",
    ".js-quality-btn",
    "range",
    "travel+=0.14",
    "12uNcnqr",
    "scrollTrigger",
    "travel+=0.52",
    "firstElementChild",
    "dataset",
    "6181CYBGZD",
    "travel+=0.18",
    "grayscale(0%)",
    "sine.inOut",
    "getBoundingClientRect",
    "disconnect",
    "sine.out",
    "utils",
    "update",
    "escape",
  ];
  _0x57aa = function () {
    return _0x5872a2;
  };
  return _0x57aa();
}
