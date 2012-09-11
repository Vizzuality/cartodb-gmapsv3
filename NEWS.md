[v 0.54]
- Fix a bug with position event from wax thanks to @sidkshatriya.

[v 0.53]
- Added a new param for setQuery that allows bounds over this query thanks to @fgblanch.

[v 0.52]
- Added some jasmine tests.
- Check if the SQL or interaction if not corretly applied.

[v 0.51]
- All functins check first if the layer belongs to the map first.
- New function isAdded returns if the layer belongs to the map.
- Hide and show check if the layer is already shown or hidden.

[v 0.50]
- Typo binding interaction (on/off).
- Triggers added when actions are performed.

[v 0.49]
- Fixed error trying to remove interaction in all layers.

[v 0.48]
- Opacity bug fixed.
- Fixed a bug when removes wax interaction.
- Updated to new wax library.

[v 0.47]
- Updated to new wax library.
- New way to manage x,y events position.

[v 0.46]
- Touch events supported
- Feature event functions renamed (featureClick,featureOut,featureOver)
- New parameter added in those functions, position. Where it returns the x and y position where user clicked or touched.
- New wax library adapted 6.2.0 (thanks @mapbox).
- setBounds function added for publicy using.
- Extend options from a util function.
- New function, setOptions, to change any param at the same time refreshing tiles once.
- Infowindow fixed for touched events.