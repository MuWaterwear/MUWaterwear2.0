import { useState } from 'react'
import { CachedUser } from './useUserProfile'

export function usePersonalizedGreeting(currentUser: any, cachedUser: CachedUser | null) {
  const [greetingRotation, setGreetingRotation] = useState(0)

  const getPersonalizedGreeting = () => {
    const firstName = currentUser?.firstName
    const favoriteWater = (cachedUser || (currentUser as any))?.favoriteBodyOfWater

    if (firstName && favoriteWater) {
      // Parse multiple bodies of water (comma, semicolon, or "and" separated)
      const splitWaters: string[] = favoriteWater.split(/[,;&]|and/i)
      const waterBodies = splitWaters
        .map((w: string) => w.trim())
        .filter((w: string) => w.length > 0)

      // Multiple greeting variations for each body of water
      const waterGreetings: Record<string, string[]> = {
        'lake tahoe': [
          `${firstName}, ready for some Tahoe clarity?`,
          `${firstName}, Tahoe's blue calls to you!`,
          `${firstName}, time to feel that alpine magic!`,
          `${firstName}, Tahoe's perfection awaits!`,
        ],
        "coeur d'alene": [
          `${firstName}, CDA is calling your name!`,
          `${firstName}, Coeur d'Alene magic time!`,
          `${firstName}, those Idaho waters miss you!`,
          `${firstName}, CDA's beauty awaits your return!`,
        ],
        'lake washington': [
          `${firstName}, time to conquer Washington waters!`,
          `${firstName}, Lake Washington beckons!`,
          `${firstName}, Seattle's gem is calling!`,
          `${firstName}, Washington waters await your splash!`,
        ],
        'flathead lake': [
          `${firstName}, Flathead's crystal waters await!`,
          `${firstName}, Montana's jewel calls to you!`,
          `${firstName}, Flathead's depths are calling!`,
          `${firstName}, Big Sky country waters await!`,
        ],
        'detroit lake': [
          `${firstName}, Detroit Lake adventures ahead!`,
          `${firstName}, Oregon's hidden gem awaits!`,
          `${firstName}, Detroit's waters are calling!`,
          `${firstName}, Cascade adventure time!`,
        ],
        'lindbergh lake': [
          `${firstName}, Lindbergh's hidden gem beckons!`,
          `${firstName}, wilderness waters call your name!`,
          `${firstName}, Lindbergh's serenity awaits!`,
          `${firstName}, Montana's secret paradise calls!`,
        ],
        'pacific ocean': [
          `${firstName}, the Pacific's endless blue awaits!`,
          `${firstName}, ocean vibes are calling!`,
          `${firstName}, Pacific power awaits your arrival!`,
          `${firstName}, time to ride those Pacific swells!`,
        ],
        'puget sound': [
          `${firstName}, Puget Sound's calling!`,
          `${firstName}, Sound adventures await!`,
          `${firstName}, PNW waters miss you!`,
          `${firstName}, Puget's tides are perfect today!`,
        ],
        'columbia river': [
          `${firstName}, the mighty Columbia flows for you!`,
          `${firstName}, Columbia's power calls to you!`,
          `${firstName}, river gorge adventures ahead!`,
          `${firstName}, Columbia's currents await!`,
        ],
        'snake river': [
          `${firstName}, Snake River rapids await!`,
          `${firstName}, Snake's wild waters call!`,
          `${firstName}, time for some river action!`,
          `${firstName}, Snake River adventure awaits!`,
        ],
        'lake crescent': [
          `${firstName}, Crescent's mystical waters call!`,
          `${firstName}, Olympic magic awaits!`,
          `${firstName}, Crescent's depths beckon!`,
          `${firstName}, peninsula paradise calls!`,
        ],
        'lake chelan': [
          `${firstName}, Chelan's deep blues are waiting!`,
          `${firstName}, Washington wine country waters call!`,
          `${firstName}, Chelan's crystal clarity awaits!`,
          `${firstName}, desert lake vibes incoming!`,
        ],
        'crater lake': [
          `${firstName}, Crater Lake's depths inspire!`,
          `${firstName}, Oregon's crown jewel calls!`,
          `${firstName}, volcanic beauty awaits!`,
          `${firstName}, Crater's blue perfection beckons!`,
        ],
        'yellowstone lake': [
          `${firstName}, Yellowstone's wilderness awaits!`,
          `${firstName}, geothermal paradise calls!`,
          `${firstName}, Yellowstone's wild waters beckon!`,
          `${firstName}, America's wonderland awaits!`,
        ],
        'jackson lake': [
          `${firstName}, Jackson's Teton views are calling!`,
          `${firstName}, Grand Teton magic awaits!`,
          `${firstName}, Wyoming wilderness calls!`,
          `${firstName}, mountain lake perfection awaits!`,
        ],
        'priest lake': [
          `${firstName}, Priest Lake's serenity beckons!`,
          `${firstName}, Idaho's northern gem calls!`,
          `${firstName}, pristine waters await your arrival!`,
          `${firstName}, Priest's peace is calling!`,
        ],
        'redfish lake': [
          `${firstName}, Redfish reflections await you!`,
          `${firstName}, Sawtooth beauty calls your name!`,
          `${firstName}, alpine perfection awaits!`,
          `${firstName}, Idaho's crown jewel beckons!`,
        ],
        'lake billy chinook': [
          `${firstName}, Billy Chinook adventures ahead!`,
          `${firstName}, Central Oregon's playground calls!`,
          `${firstName}, canyon waters await your splash!`,
          `${firstName}, Billy Chinook magic time!`,
        ],
        'cascade lakes': [
          `${firstName}, the Cascades are calling!`,
          `${firstName}, mountain lake paradise awaits!`,
          `${firstName}, alpine adventure time!`,
          `${firstName}, Cascade magic beckons!`,
        ],
        'hood canal': [
          `${firstName}, Hood Canal's mysteries await!`,
          `${firstName}, Puget Sound's hidden arm calls!`,
          `${firstName}, Hood's depths beckon!`,
          `${firstName}, canal adventures ahead!`,
        ],
        'san juan islands': [
          `${firstName}, the San Juans are your playground!`,
          `${firstName}, island paradise calls to you!`,
          `${firstName}, San Juan magic awaits!`,
          `${firstName}, archipelago adventures ahead!`,
        ],
        'lake sammamish': [
          `${firstName}, Sammamish's shores welcome you!`,
          `${firstName}, Eastside beauty calls!`,
          `${firstName}, Sammamish serenity awaits!`,
          `${firstName}, lake life perfection beckons!`,
        ],
      }

      // Get current water body (rotate through them if multiple)
      const currentWaterIndex = greetingRotation % waterBodies.length
      const currentWater = waterBodies[currentWaterIndex].toLowerCase()

      // Get greetings for this water body
      const greetings = waterGreetings[currentWater]

      if (greetings && greetings.length > 0) {
        // Rotate through greetings for this water body
        const greetingIndex = Math.floor(greetingRotation / waterBodies.length) % greetings.length
        return greetings[greetingIndex]
      }

      // Fallback for any other body of water
      const fallbackGreetings = [
        `${firstName}, ${waterBodies[currentWaterIndex]} is lucky to have you!`,
        `${firstName}, time for some ${waterBodies[currentWaterIndex]} magic!`,
        `${firstName}, ${waterBodies[currentWaterIndex]} adventure awaits!`,
        `${firstName}, ${waterBodies[currentWaterIndex]} perfection calls!`,
      ]
      const fallbackIndex = greetingRotation % fallbackGreetings.length
      return fallbackGreetings[fallbackIndex]
    }

    if (firstName) {
      // Multiple general greetings for users without favorite water
      const generalGreetings = [
        `Hi ${firstName}, ready to make waves?`,
        `${firstName}, time to dive into something epic!`,
        `${firstName}, the water is calling your name!`,
        `${firstName}, let's create some splash!`,
        `${firstName}, adventure awaits in the blue!`,
      ]
      const greetingIndex = greetingRotation % generalGreetings.length
      return generalGreetings[greetingIndex]
    }

    // Default greetings for users without names
    const defaultGreetings = [
      `Ready to dive into something epic?`,
      `The water is calling your name!`,
      `Time to make some waves!`,
      `Adventure awaits in the blue!`,
      `Let's create some splash!`,
    ]
    const greetingIndex = greetingRotation % defaultGreetings.length
    return defaultGreetings[greetingIndex]
  }

  const rotateGreeting = () => {
    setGreetingRotation(prev => prev + 1)
  }

  return {
    getPersonalizedGreeting,
    rotateGreeting,
  }
}
