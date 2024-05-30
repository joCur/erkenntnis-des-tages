interface CircleProps {
  x: number
  y: number
  radius: number
}

const Circle: React.FC<CircleProps> = ({ x, y, radius }) => (
  <div
    className="circle"
    style={{
      width: radius * 2,
      height: radius * 2,
      borderRadius: '50%',
      position: 'absolute',
      left: x - radius,
      top: y - radius,
      border: '1px solid white',
    }}
  ></div>
)

interface GeneralOrderProps {
  size: number
}

export const GeneralOrder: React.FC<GeneralOrderProps> = (props) => {
  const { size } = props
  const largeRadius = size
  const smallRadius = size / 6
  const smallCircleCount = 10
  const centerX = 110
  const centerY = 110
  const circles = []
  const angleStep = (2 * Math.PI) / smallCircleCount

  for (let i = 0; i < smallCircleCount; i++) {
    const angle = i * angleStep
    const x = centerX + largeRadius * Math.cos(angle)
    const y = centerY + largeRadius * Math.sin(angle)
    circles.push(<Circle key={i} x={x} y={y} radius={smallRadius} />)
  }

  return (
    <div
      style={{
        width: 2 * (largeRadius + smallRadius),
        height: 2 * (largeRadius + smallRadius),
        position: 'absolute',
        zIndex: 0,
        top: '38%',
        left: '43%',
      }}
    >
      <Circle x={centerX} y={centerY} radius={largeRadius} />
      {circles}
    </div>
  )
}
