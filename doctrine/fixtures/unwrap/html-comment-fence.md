### Core.Comms.Robot.Desired.iface  ("Robot Interface")
<!-- F-17 (drafted 2026-07-28): shipped with no Chapter-1 description. Landed with Comms P3. -->
- Surfaces: Installation
- Current: "Network interface the desired robot IP is enforced on."
- Proposed:
```markdown
MegaCap enforces the desired robot IP on this network interface. The choice matters only when **Enforce Robot IP** is enabled and **Robot IP Address** holds an address.

- **eth0** → the controller's built-in port, and the USB network adapter on a coordinated-motion cell.
- **eth1** → the escape hatch, for a controller whose robot network sits on the second port.

> [!NOTE]
> When the controller carries no interface of this name, MegaCap reports a missing interface and writes nothing at all. A missing port is a wiring fault, and enforcement cannot correct it.

-# Set on the Robot Network card, alongside **Robot IP Address** and **Robot Network Prefix**.
```
- Citations:
