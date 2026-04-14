import { MapIcon, BarChart3, Bell } from "lucide-react"

const steps = [
  {
    icon: MapIcon,
    title: "eBird + BirdSnap Data",
    description: "Thousands of birders report sightings daily to eBird and BirdSnap. We aggregate this data in real time.",
  },
  {
    icon: BarChart3,
    title: "Smart Analysis",
    description: "We filter 10 hummingbird species across North America and plot their northward journey on a live 3D map.",
  },
  {
    icon: Bell,
    title: "Your Personal Alert",
    description: "Enter your ZIP once. We'll email you the moment hummingbirds are reported within 150 miles of your home.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-sm font-medium text-[#999999] uppercase tracking-wider mb-10">
          How It Works
        </h3>

        <div className="grid grid-cols-3 gap-4 md:gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F7F5F0] flex items-center justify-center mx-auto mb-2 md:mb-4">
                <step.icon className="h-4 w-4 md:h-5 md:w-5 text-[#5B6751]" />
              </div>
              <h4 className="font-medium text-[#2C2C2C] mb-1 md:mb-2 text-xs md:text-base">{step.title}</h4>
              <p className="text-[10px] md:text-sm text-[#4A4A4A] leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
