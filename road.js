class Road{
    constructor(x,width,laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2;
        this.right=x+width/2;

        const infinity=1000000;
        this.top=-infinity;
        this.bottom=infinity;

        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.right,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right,y:this.bottom};
        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];

        // Load tree image
        this.treeImg = new Image();
        this.treeImgLoaded = false;
        
        this.treeImg.onload = () => {
            this.treeImgLoaded = true;
        };
        
        this.treeImg.onerror = () => {
            console.log("Failed to load trees.png - using fallback trees");
            this.treeImgLoaded = false;
        };
        
        this.treeImg.src = "trees.png";
    }

    getLaneCenter(laneIndex){
        const laneWidth=this.width/this.laneCount;
        return this.left+laneWidth/2+
            Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    draw(ctx){
        // Draw trees first (background layer)
        this.drawTrees(ctx);
        
        // Draw road surface
        ctx.fillStyle = "#404040";
        ctx.fillRect(this.left, this.top, this.width, this.bottom - this.top);
        
        // Draw lane markings
        ctx.lineWidth=3;
        ctx.strokeStyle="#FFD700";

        for(let i=1;i<=this.laneCount-1;i++){
            const x=lerp(
                this.left,
                this.right,
                i/this.laneCount
            );
            
            ctx.setLineDash([20,20]);
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }

        // Draw road borders
        ctx.setLineDash([]);
        ctx.lineWidth=5;
        ctx.strokeStyle="#FFFFFF";
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
    }

    drawTrees(ctx) {
        const treeSpacing = 80;
        const treeSize = 40;
        
        // Get canvas bounds for proper positioning
        const canvasWidth = ctx.canvas.width;
        const leftTreeX = this.left - 35;
        const rightTreeX = this.right + 35;
        
        if(leftTreeX < 0 || rightTreeX > canvasWidth) {
            return; 
        }
        
        // Draw trees on both sides within visible area
        for(let y = -200; y < ctx.canvas.height + 200; y += treeSpacing) {
            // Random offset for natural look
            const leftOffset = (Math.sin(y * 0.01) * 10);
            const rightOffset = (Math.cos(y * 0.01) * 10);
            
            // Random size variation
            const leftSizeVariation = 0.8 + Math.sin(y * 0.005) * 0.3;
            const rightSizeVariation = 0.8 + Math.cos(y * 0.007) * 0.3;
            
            const leftTreeSize = treeSize * leftSizeVariation;
            const rightTreeSize = treeSize * rightSizeVariation;
            
            const leftX = leftTreeX + leftOffset;
            const rightX = rightTreeX + rightOffset;
            
            if(this.treeImgLoaded) {
                // Draw left side tree with image
                ctx.drawImage(
                    this.treeImg, 
                    leftX - leftTreeSize/2, 
                    y - leftTreeSize/2, 
                    leftTreeSize, 
                    leftTreeSize
                );
                
                // Draw right side tree with image
                ctx.drawImage(
                    this.treeImg, 
                    rightX - rightTreeSize/2, 
                    y - rightTreeSize/2, 
                    rightTreeSize, 
                    rightTreeSize
                );
            } else {
                // Fallback: draw simple trees if image fails to load
                this.drawFallbackTree(ctx, leftX, y, leftTreeSize);
                this.drawFallbackTree(ctx, rightX, y, rightTreeSize);
            }
        }
    }

    drawFallbackTree(ctx, x, y, size) {
        ctx.save();
        
        // Tree trunk
        ctx.fillStyle = "#8B4513";
        const trunkWidth = size * 0.15;
        const trunkHeight = size * 0.4;
        ctx.fillRect(x - trunkWidth/2, y, trunkWidth, trunkHeight);
        
        // Tree foliage
        ctx.fillStyle = "#228B22";
        const foliageRadius = size * 0.35;
        
        // Main foliage circle
        ctx.beginPath();
        ctx.arc(x, y - foliageRadius/2, foliageRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x - foliageRadius/3, y - foliageRadius/3, foliageRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + foliageRadius/3, y - foliageRadius/3, foliageRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}