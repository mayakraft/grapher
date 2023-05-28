# Blender-style graph maker

### project outline and plan

This will be 2D (for now), rendering in SVG, with a toolbar GUI interface, with keyboard and mouse/touchpad input. The application core can be accessed via terminal, most application and graph-modifying operations can be typed in and manually run. The graph data model is based on FOLD, with vertices, edges, and faces, where edges can contain attributes. SVG file import will be supported. Rabbit Ear will be used for graph operations such as planarizing, vertex merging, face finding. The backend will be built in a manner such that the front end could one day be swapped out for a 3D interface, handle 3D FOLD graph data, with as few changes as possible needed to make this change.

## features: graph operations

### create vertices or edges or faces

- vertex: click to create new vertex. isolated vertex added to graph.
- edge-1: draw a line segment, which creates an edge and 2 vertices, or uses existing vertices.
- edge-2: be selecting two non-adjacent vertices, create an edge between them.
- face-1: be selecting three or more vertices, create a face.
- face-2: be selecting three or more edges, create a face.

faces_vertices and faces_edges will always be in sync. for a face to exist, all edges between adjacent vertices must exist.

### turn on/off vertex snapping to grid

- new vertices will be snapped to the grid (old will be untouched)
- snap all, all vertices are shifted to their nearest grid coordinate.

UI: toggle-new vertex snapping, button-snap all

### delete V/E/F

- deleting a vertex: will delete any adjacent edges, faces.
- deleting an edge: will delete any adjacent faces, and any isolated vertices. (this is a problem, someone might want to keep the isolated vertex.)
- deleting a face: will not delete any edges or vertices.

UI: no new ui. use select tool and keyboard "delete"

### edge attributes

- change assignment
- change fold angle

UI: see solutions in cp.rabbitear.org/beta/

### graph indices stuff

- change face winding
- change index of V/E/F in its array
   - swap one index with another
   - set an index (auto swap)

UI: not sure, some ideas: swap: click one then the other, swap happens. click one, type a number press enter, swap happens. enter into series beginning with 0, click one after another, auto increments.

### planarize the graph

simple. maybe we have options for epsilon or something but probably not needed.

UI: button

## features: application operations

### set canvas size

canvas size is like the photoshop/illustrator canvas. you can still draw outside of the canvas. canvas is more of a designer tool stating "this is the area i would like to create inside."

show grid lines for the canvas

### zoom and move view around

- also reset view

UI: button to reset view. tool item for panning and zooming view but the functionality is duplicated on the trackpad.

### select vertices or edges or faces

- ability to select multiple (of the same) at once.
- rectangular selection

UI: tool button for select.

### export file as

- fully-saturated FOLD
- minimal FOLD

UI: menubar buttons

### import

- load FOLD (warn if 3D)
- import SVG, planarize, etc.

UI: menubar buttons, popup for SVG import. see: foldfile.com

## terminal

all operations described on here can be expressed as a text-based command. as you perform an operation with the UI, the command text is filled into the terminal. the terminal interface is also accessible to the user to be able to write these commands manually. For example this is a feature in Rhino3D, recreate this same functionality.

# outline: code

### signals/stores

- app: the current UI tool.
- app: can select which: V, E, F.
- currently selected graph component indices.
- currently hovered-over graph component indices.
- device input:
   - keyboard, dictionary of currently pressed keys (for shift-clicking).
   - mouse/touch events on SVG canvas. onpress, onrelease, onmove. one array for each.
- preferences:
   - vertex snapping
- app: current view zoom

- the FOLD graph (a single FOLD frame).
- possibly: the FOLD metadata (all "file_" keys).

### InputManager

the manager knows about the currently selected UI tool, and all input is passed through here and converted into commands to be sent to the engine.

input (mouse, keyboard) events are stored into a collection as they arrive, until the proper conditions have been met (based on the current tool), then the command is executed and the event storage is modified, for example, emptied in preparation for the next command.

unsorted notes:

for example the "delete currently selected" should perform the delete call, which, hopefully is a single function call to the Rabbit Ear library which makes a change to the data model, but then contains additional methods for the UI, such as to clear the currently selected set of components. so, an operation on the graph is in most cases actually an encapsulated function that contains the graph modify call, along with other application-specific and UI related calls. as far as what appears inside the "terminal", it should appear as one function call. "delete edge 4"

