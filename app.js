const canvas = document.getElementById("canvas")

class Paint{
    constructor(width, height, pixelSize, color){
        canvas.width = width
        canvas.height = height
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.pixelSize = pixelSize
        this.color = color
        this.isMouseDown = false
    }
    toNumericalRepresentation(shouldBeDrown) {
        let cellsToDraw = []
        const numericalrepresentanion = []
        for(let x = 0; x < globalThis.canvas.width; x+=this.pixelSize){
            for(let y = 0; y < globalThis.canvas.height; y+=this.pixelSize){
                const cell = this.ctx.getImageData(x,y,this.pixelSize,this.pixelSize)
                let isFilled = false
                for(let i = 0; i < cell.data.length; i+=10){
                    if(cell.data[i] !=0){
                        isFilled = true
                        break
                    }
                }
                console.log(isFilled)
                if(isFilled){
                    numericalrepresentanion.push(1)
                    cellsToDraw.push({x,y})
                }else{
                    numericalrepresentanion.push(0)
                }
            }
        }
        console.log(cellsToDraw)
                if(shouldBeDrown) {
                    cellsToDraw.forEach((cell) => this.drawCell(cell.x,cell.y, this.pixelSize))
                }
                return(numericalrepresentanion)
    }
    drawCircle(x,y, radius,color){
        this.ctx.beginPath()
        this.ctx.fillStyle = color
        this.ctx.arc(x,y,radius,0,Math.PI*2)
        this.ctx.fill()
    }
    drawConnectingLine(x,y,lineWidth,color){
        this.ctx.lineTo(x,y)
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeStyle = color
        this.ctx.stroke()
    }
    drawCell(x1,y1,size,color="blue"){
        this.ctx.beginPath()
        this.ctx.fillStyle = color
        this.ctx.rect(x1,y1,size,size)
        this.ctx.fill()
    }
    clear(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    }
    run(){
        this.canvas.addEventListener('mousedown', () => {
            this.isMouseDown = true
            this.ctx.beginPath()
            console.log("mousedown")
        })
        this.canvas.addEventListener('mouseup', () => {
            this.isMouseDown = false
            console.log("mouseup")
        })
        this.canvas.addEventListener('mousemove', (e) => {
            if(this.isMouseDown){
                const x = e.offsetX
                const y = e.offsetY

                this.drawConnectingLine(x,y,this.pixelSize*2,this.color)

                this.drawCircle(x,y,this.pixelSize, this.color)

                this.ctx.beginPath()
                this.ctx.moveTo(x,y)

            }
        })
    }
}
const paint = new Paint(300,300,7,"red")
paint.run()
const statistic = []
const addToStatistic = (name, numericalRepresentanion) => {
    statistic.push({
        input: numericalRepresentanion,
        output: {
            [name]: 1
        }
       })
}
document.getElementById("C").onclick = () =>{
    paint.clear()
}
document.getElementById("V").onclick = () =>{
   const numericalRepresentanion = paint.toNumericalRepresentation(true)
   addToStatistic(prompt("What is on the image?"), numericalRepresentanion)
   paint.clear()
}
document.getElementById("B").onclick = () =>{
    const neuralNetwork = new brain.NeuralNetwork()
    neuralNetwork.train(statistic, {log: true})
    const numericalRepresentanion = paint.toNumericalRepresentation()
    const result = brain.likely(numericalRepresentanion,neuralNetwork)
    if(confirm(`Is there ${result} on picrute?`)){
        addToStatistic(result,  numericalRepresentanion)
    }else{
        addToStatistic(prompt("Then what is on the image?"), numericalRepresentanion)
    }
    paint.clear()
}