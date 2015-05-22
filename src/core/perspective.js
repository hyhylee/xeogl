/**
 A **Perspective** component defines a perspective projection transform.

 ## Overview

 <ul>

 <li>{{#crossLink "Camera"}}Camera{{/crossLink}} components pair these with viewing transform components, such as
 {{#crossLink "Lookat"}}Lookat{{/crossLink}}, to define viewpoints on attached {{#crossLink "GameObject"}}GameObjects{{/crossLink}}.</li>
 <li>Alternatively, use {{#crossLink "Ortho"}}{{/crossLink}} if you need a orthographic projection.</li>

 </ul>

 <img src="../../../assets/images/Perspective.png"></img>

 ## Example

 In this example we have a {{#crossLink "GameObject"}}GameObject{{/crossLink}} that's attached to a
 {{#crossLink "Camera"}}Camera{{/crossLink}} that has a {{#crossLink "Lookat"}}Lookat{{/crossLink}} view transform and a Perspective
 projection transform.

 ````Javascript
 var scene = new XEO.Scene();

 var perspective = new XEO.Perspective(scene, {
    fovy: 60,
    near: 0.1,
    far: 1000
 });

 var camera = new XEO.Camera(scene, {
    project: perspective
 });

 var geometry = new XEO.Geometry(scene);  // Defaults to a 2x2x2 box

 var object = new XEO.GameObject(scene, {
    camera: camera,
    geometry: geometry
 });
 ````
 @class Perspective
 @module XEO
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}}, creates this Perspective within the
 default {{#crossLink "Scene"}}Scene{{/crossLink}} when omitted.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent scene, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Perspective.
 @param [cfg.fovy=60.0] {Number} Field-of-view angle, in degrees, on Y-axis.
 @param [cfg.aspect=1.0] {Number} Aspect ratio.
 @param [cfg.near=0.1] {Number} Position of the near plane on the View-space Z-axis.
 @param [cfg.far=10000] {Number} Position of the far plane on the View-space Z-axis.
 @extends Component
 */
(function () {

    "use strict";

    XEO.Perspective = XEO.Component.extend({

        className: "XEO.Perspective",

        type: "project",

        _init: function (cfg) {

            // Renderer state
            this._state = this._renderer.createState({
                matrix: null
            });

            this._dirty = false;
            this._fovy = 60.0;
            this._aspect = 1.0;
            this._near = 0.1;
            this._far = 10000.0;

            var self = this;
            var canvas = this.scene.canvas;

            // Recompute aspect from change in canvas size
            this._canvasResized = canvas.on("resized",
                function () {
                    self._aspect = canvas.width / canvas.height;
                });

            this.fovy = cfg.fovy;
            this.aspect = canvas.width / canvas.height;
            this.near = cfg.near;
            this.far = cfg.far;
        },

        // Schedules a call to #_build on the next "tick"
        _scheduleBuild: function () {
            if (!this._dirty) {
                this._dirty = true;
                var self = this;
                this.scene.once("tick",
                    function () {
                        self._build();
                    });
            }
        },

        // Rebuilds renderer state from component state
        _build: function () {

            this._state.matrix = XEO.math.perspectiveMatrix4(this._fovy * Math.PI / 180.0, this._aspect, this._near, this._far);

            this._dirty = false;

            /**
             * Fired whenever this Perspective's {{#crossLink "Perspective/matrix:property"}}{{/crossLink}} property changes.
             *
             * @event matrix
             * @param value The property's new value
             */
            this.fire("matrix", this._state.matrix);
        },

        _props: {

            /**
             * The angle, in degrees on the Y-axis, of this Perspective's field-of-view.
             *
             * Fires a {{#crossLink "Perspective/fovy:event"}}{{/crossLink}} event on change.
             *
             * @property fovy
             * @default 60.0
             * @type Number
             */
            fovy: {

                set: function (value) {

                    this._fovy = (value !== undefined && value !== null) ? value : 60.0;

                    this._renderer.imageDirty = true;

                    this._scheduleBuild();

                    /**
                     * Fired whenever this Perspective's {{#crossLink "Perspective/fovy:property"}}{{/crossLink}} property changes.
                     *
                     * @event fovy
                     * @param value The property's new value
                     */
                    this.fire("fovy", this._fovy);
                },

                get: function () {
                    return this._fovy;
                }
            },

            /**
             * Aspect ratio of this Perspective frustum. This is effectively the height of the frustum divided by the width.
             *
             * Fires an {{#crossLink "Perspective/aspect:property"}}{{/crossLink}} event on change.
             *
             * @property aspect
             * @default 60.0
             * @type Number
             */
            aspect: {

                set: function (value) {

                    this._aspect = (value !== undefined && value !== null) ? value : 1.0;

                    this._renderer.imageDirty = true;

                    this._scheduleBuild();

                    /**
                     * Fired whenever this Perspective's {{#crossLink "Perspective/aspect:property"}}{{/crossLink}} property changes.
                     *
                     * @event aspect
                     * @param value The property's new value
                     */
                    this.fire("aspect", this._aspect);
                },

                get: function () {
                    return this._aspect;
                }
            },

            /**
             * Position of this Perspective's near plane on the positive View-space Z-axis.
             *
             * Fires a {{#crossLink "Perspective/near:event"}}{{/crossLink}} event on change.
             *
             * @property near
             * @default 0.1
             * @type Number
             */
            near: {

                set: function (value) {

                    this._near = (value !== undefined && value !== null) ? value : 0.1;

                    this._renderer.imageDirty = true;

                    this._scheduleBuild();

                    /**
                     * Fired whenever this Perspective's   {{#crossLink "Perspective/near:property"}}{{/crossLink}} property changes.
                     * @event near
                     * @param value The property's new value
                     */
                    this.fire("near", this._near);
                },

                get: function () {
                    return this._near;
                }
            },

            /**
             * Position of this Perspective's far plane on the positive View-space Z-axis.
             *
             * Fires a {{#crossLink "Perspective/far:event"}}{{/crossLink}} event on change.
             *
             * @property far
             * @default 10000.0
             * @type Number
             */
            far: {

                set: function (value) {

                    this._far = this._near = (value !== undefined && value !== null) ? value : 10000;

                    this._renderer.imageDirty = true;

                    this._scheduleBuild();

                    /**
                     * Fired whenever this Perspective's  {{#crossLink "Perspective/far:property"}}{{/crossLink}} property changes.
                     *
                     * @event far
                     * @param value The property's new value
                     */
                    this.fire("far", this._far);
                },

                get: function () {
                    return this._far;
                }
            },

            /**
             * The elements of this Perspective's projection transform matrix.
             *
             * Fires a {{#crossLink "Perspective/matrix:event"}}{{/crossLink}} event on change.
             *
             * @property matrix
             * @type {Float64Array}
             */
            matrix: {

                get: function () {

                    if (this._dirty) {
                        this._build();
                    }

                    return this._state.matrix.slice(0);
                }
            }
        },

        _compile: function () {
            this._renderer.projectTransform = this._state;
        },

        _getJSON: function () {
            return {
                fovy: this._fovy,
                aspect: this._aspect,
                near: this._near,
                far: this._far
            };
        },

        _destroy: function () {

            this.scene.canvas.off(this._canvasResized);

            this._renderer.destroyState(this._state);
        }
    });

})();