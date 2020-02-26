import { Texture } from '@sveltejs/gl'

export const colormap = new Texture('/textures/mossy-stone/basecolor.png')
export const bumpmap = new Texture('/textures/mossy-stone/height.png')
export const normalmap = new Texture('/textures/mossy-stone/normal.png')
// export const bumpscale = .9