/**
 * Class for the level. It contains the objects of the level, such as chickens, clouds and background.
 * It also contains the end of the level, which is used to determine when the character has reached the end of the level.
 */
class Level {
    chicken;
    cloud;
    background;
    level_end_x = 2500;

    /**
     * 
     * @param {*} chicken 
     * @param {*} cloud 
     * @param {*} background 
     */
    constructor(chicken, cloud, background) {
        this.chicken = chicken;
        this.cloud = cloud;
        this.background = background;
    }
}