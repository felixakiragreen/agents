# The fixture building register

The control for the register arm (C39, D79): Name · Kind · Root. A Root written relative
addresses the register file's own neighbourhood, so a fixture registers its siblings and the
suite reads nothing outside this repo.

| Name | Kind | Root |
|---|---|---|
| alpha | building | `../alpha` |
| bare | building | `../bare` |
| campus | host | `../campus` |
