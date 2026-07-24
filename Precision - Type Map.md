> ⚠️ **RETRACTED.** Every filter in this cascade was arbitrary scaffolding, not CBI. Selection is CBI-only; these metrics are for H2H against an already-CBI-filtered list. Superseded by the everybody list (`Precision - Everybody Measurements.csv`) + `engine/precision/profile.py`. Kept for history.

# Precision — Type Map (cascade classifier)

*The method realized: throw in everyone, **disqualify type by type** until the target survives. No single metric splits Legacy from Visionary — the filters strip away everything that *isn't* one of them, and the eye makes the final binary call on a pre-filtered pool. Code: `engine/precision/classify.py`.*

## The cascade (first match wins)
| Step | Type | Filter | Status |
|---|---|---|---|
| 1 | **First-strike** | style index ≤ −0.6 | ✅ clean |
| 2 | **Pda (presser)** | forces ≥ 3.5 (makes you beat yourself) | ✅ clean |
| 3 | **Intentional** | steal (drop+lob) ≥ p80 (grabs the gap) | ✅ clean |
| 4 | **Legacy (outlaster)** | wins 9+ ≫ 1–4 | ⚠️ **leaky** — see below |
| 5 | **Legacy/Visionary (eye)** | the survivors | 👁️ eye splits Past vs Future |

## Counts
| Type | MEN (186) | WOMEN (132) |
|---|---|---|
| First-strike | 40 | 25 |
| Pda (presser) | 13 | 7 |
| Intentional | 21 | 20 |
| Legacy (outlaster) | 53 | 35 |
| Legacy/Visionary (eye) | 59 | 45 |

## Validation
All **13 men + Świątek** ground-truth anchors classify correctly:
- Schwartzman/Navone/Chung → **Pda**; Alcaraz/Musetti/Rune → **Intentional**;
  Isner/Kyrgios → **First-strike**; Nadal/Simon → **Legacy (outlaster)**;
  Djokovic/Medvedev/Sinner/Świątek → **eye pool** (the four no stat can split).

## Honest status
- **Filters 1–3 are clean** — anchor-validated and face-valid.
- **Filter 4 (Legacy-outlaster) is unvalidated for non-anchor names.** It catches "wins 9+ ≫ 1–4." The Legacy anchors (Nadal, Simon) land here correctly. Other names (Ostapenko, Rublev, Agassi…) also land here — **whether that's wrong is a CBI question, not a tennis one.** "Basher" is *not* a CBI trait; a Concrete-Past-Other player can hit hard. So these are **not** demonstrable false positives — they're simply un-ground-truthed. Needs Robert's CBI labels to confirm or reject, not a power/style eyeball.
- **The eye pool is the residual** — everyone in it is Legacy or Visionary. Data narrowed 186 → 59 (men), 132 → 45 (women); the eye makes the final Past/Future call.

## The eye pool — split these by eye (Past=Legacy / Future=Visionary)

**MEN (59):** Shevchenko, Zverev, Popyrin, Bedene, Chesnokov, Murray, Tomic, **Borg**, Moya, Pioline, **Medvedev**, Shapovalov, Thiem, Koepfer, Lajovic, F. Lopez, Auger-Aliassime, Verdasco, Monfils, Pella, **Kuerten**, Ivashka, **Lendl**, Mensik, Tipsarevic, **Sinner**, Chardy, Courier, J. Novak, Tsonga, Fonseca, Sousa, Thompson, **Ferrero**, **Del Potro**, Khachanov, Djere, **Hewitt**, **Safin**, Baghdatis, Cilic, Fucsovics, **Wilander**, Kecmanovic, Almagro, Massu, **Djokovic**, **Federer**, **Wawrinka**, Taro Daniel, Kokkinakis, **Muster**, Berdych, Etcheverry, Haas, Tommy Paul, Humbert, W. Ferreira

**WOMEN (45):** Riske, Bogdan, Ivanovic, Kontaveit, **Kerber**, Bondar, Rus, **Sánchez Vicario**, **Barty**, **Krejcikova**, Haddad Maia, Suárez Navarro, **Wozniacki**, **Gauff**, Svitolina, Mertens, Raducanu, Bouchard, Pennetta, **Muguruza**, **Świątek**, Iva Jovic, Cristian, Jankovic, **Pegula**, **Henin**, **Muchova**, Lin Zhu, **Davenport**, Samsonova, Brengle, **Keys**, Kostyuk, **Andreeva**, Martic, **Zheng**, Stosur, Rogers, **Graf**, Lamens, **Kuznetsova**, **Venus Williams**, Kudermetova, Mboko, Yafan Wang

*(Bold = all-time/elite anchors to read first.)*

Data: Jeff Sackmann Match Charting Project (men + women, `master`).
