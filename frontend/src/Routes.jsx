import React, { lazy } from 'react'

export const Home = lazy(() => import('./pages/Home'))
export const Collections = lazy(() => import('./pages/Collections'))
export const Product = lazy(() => import('./pages/Product'))
export const Cart = lazy(() => import('./pages/Cart'))
export const Checkout = lazy(() => import('./pages/Checkout'))
export const About = lazy(() => import('./pages/About'))