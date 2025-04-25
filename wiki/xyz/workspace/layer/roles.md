# .roles{}

Role objects within the `layer.roles{}` define which user roles have access to a layer.

Any role object referenced by its key in the `mapp.user.roles[]` array will be merged with the JSON layer when the layer is decorated by the MAPP library.

Likewise any negated role object will be merged if the user does not have the referenced role.

A `.filter{}` object can be defined within a role. This filter will always be applied by any query which references the layer.

The asterisk role (_) is a reserved role which will not be returned from the roles.get() method to the admin panel.
Setting `"_": true` as a layer role simply makes the layer available to every user, even user without any roles. This does not have an effect merging, or filter associated with other roles on the layer.

```json
"roles": {
  "*": true,
  "foo": true,
  "!point": {
    "draw": {
      "polygon": true
    }
  },
  "draw_role": {
    "draw": {
      "point": true
    }
  },
  "fascia_filter": {
    "filter": {
      "fascia": {
        "in": ["Budgens", "Waitrose"]
      }
    }
  }
}
```
